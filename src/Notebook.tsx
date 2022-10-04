import "./App.css";
import { useState, useEffect, useReducer } from "react";
import { urbitVisor } from "@dcspark/uv-core";
import type { Graph, Post, Content, TextContent } from "./types";
import Spinner from "./Spinner";
import { extract } from 'article-parser'
import TurndownService from 'turndown'
interface NotebookProps {
	ship: string; // ship name
	api: any;
}

function Notebook(props: NotebookProps) {
	useEffect(() => {
		const api = props.api;
		api	
		// urbitVisor
			.scry({
				app: "graph-store",
				path: `/graph/~${props.ship}/cyclopaedia`,
			})
			.then((res) => {
				console.log(res, "scried")
				setPosts({
					type: "add-post",
					payload: res["graph-update"]["add-graph"]["graph"],
				});
				setLoading(false);
			});
		urbitVisor.on("sse", ["graph-update", "add-nodes"], handleAddNodes);
		urbitVisor.on("sse", ["graph-update", "remove-posts"], handleRemovePosts);
		urbitVisor.subscribe({ app: "graph-store", path: "/updates" });
	}, []);

	// function getPosts() {
	// 	// Get api from props
	// 	const api = props.api;
	// 	api	
	// 		.scry({
	// 			app: "graph-store",
	// 			path: `/graph/~${props.ship}/cyclopaedia`,
	// 		})
	// 		.then((res) => {
	// 			console.log(res, "======= GET POSTS CHECK")
	// 			// setPosts({
	// 			// 	type: "add-post",
	// 			// 	payload: res["graph-update"]["add-graph"]["graph"],
	// 			// });
	// 			setLoading(false);
	// 		});
	// }
	// getPosts();

	function extractArticle() {
		var td = new TurndownService();
		// const input = "https://urbit.org/blog/convivial-networks";
		extract(articleUrl)
			.then((article) => {
				// var content = turndown(article.content);
				var content = td.turndown(article.content);
				var title = article.title;
				setTitle(title);
				setText(content);
				console.log(td.turndown(article.content), "content")
				// document.body.innerHTML = article.content;
			})
			.catch((err) => console.error(err));
	}

	const postReducer = (state: Graph, action) => {
		switch (action.type) {
			case "add-post":
				const nod = Object.entries(action.payload).map((entry) => {
					const key = entry[0].replace("/", "");
					return [key, entry[1]];
				});
				const nodes = Object.fromEntries(nod);
				return { ...state, ...nodes };
			case "delete-post":
				const { [action.payload]: deletedPost, ...rest } = state;
				return rest;
			case "edit-post":
				const index = Object.keys(action.payload)[0];
				const base_index = Object.keys(action.payload)[0].split("/")[1];
				const revision = Object.keys(action.payload)[0].split("/")[3];
				const post = state[base_index];
				post.children["1"].children[revision] = action.payload[index];
				const editedPost = {};
				editedPost[base_index] = post;
				return { ...state, ...editedPost };
		}
	};
	const initialPosts: Graph = {};
	const [posts, setPosts] = useReducer(postReducer, initialPosts);
	const [loading, setLoading] = useState(true);
	const spinner = (
		<Spinner width={40} height={40} innerColor="white" outerColor="black" />
	);
	const [articleUrl, setArticleUrl] = useState("https://urbit.org/blog/convivial-networks");
	const [title, setTitle] = useState("");
	const [text, setText] = useState("");
	const [selected, setSelected] = useState<Post>(null);

	function buildPost(index: string, contents: Content[] = []) {
		return {
			author: "~" + props.ship,
			contents: contents,
			hash: null,
			index: index,
			signatures: [],
			"time-sent": Date.now(),
		};
	};
	function addNotebookPost() {
		setLoading(true);
		const indexes: bigint[] = graphToList(posts).map((p) => p.index);
		const last: bigint = indexes.reduce(
			(acc: bigint, cur: bigint) => (acc > cur ? acc : cur),
			0n
		);
		const index = `/${last + 1n}`.replace("n", "");
		const contents = [{ text: title }, { text: text }];
		const children = {
			"1": {
				post: buildPost(`${index}/1`),
				children: {
					"1": {
						children: null,
						post: buildPost(`${index}/1/1`, contents),
					},
				},
			},
			"2": {
				post: buildPost(`${index}/2`),
				children: null,
			},
		};
		const nodes = {};
		nodes[index] = {
			children: children,
			post: buildPost(index),
		};
		const body = {
			"add-nodes": {
				resource: { name: "cyclopaedia", ship: `~${props.ship}` },
				nodes: nodes,
			},
		};
		urbitVisor
			.poke({ app: "graph-store", mark: "graph-update-3", json: body })
			.then((res) => console.log(res));
	};

	function editPost() {
		if (title === "" && text === "") deletePost();
		else modifyPost();
	};
	function deletePost() {
		setLoading(true);
		const body = {
			"remove-posts": {
				resource: {
					ship: `~${props.ship}`,
					name: "cyclopaedia",
				},
				indices: [`/${selected.index}`],
			},
		};
		urbitVisor
			.poke({ app: "graph-store", mark: "graph-update-3", json: body })
			.then((res) => console.log(res));
	};
	function modifyPost() {
		setLoading(true);
		const last: number = Object.keys(selected.revisions).reduce(
			(acc: number, item: string) =>
				acc > parseInt(item) ? acc : parseInt(item),
			0
		);
		const index = `/${selected.index}/1/${last + 1}`;
		const contents = [{ text: title }, { text: text }];
		const nodes = {};
		nodes[index] = {
			children: null,
			post: buildPost(`${index}`, contents),
		};
		const body = {
			"add-nodes": {
				resource: { name: "cyclopaedia", ship: `~${props.ship}` },
				nodes: nodes,
			},
		};
		urbitVisor
			.poke({ app: "graph-store", mark: "graph-update-3", json: body })
			.then((res) => console.log(res));
	}

	function handleAddNodes(data: any) {
		console.log(data, "data added")
		setLoading(false);
		if (Object.keys(data.nodes)[0].split("/").length > 3)
			//  if it's an update an edited post, go update the post
			setPosts({ type: "edit-post", payload: data.nodes });
		else setPosts({ type: "add-post", payload: data.nodes }); // if it's an update about a new post, go add the post to the post list
	};
	function handleRemovePosts(data: any) {
		setLoading(false);
		const [index] = data.indices;
		setPosts({ type: "delete-post", payload: index.replace("/", "") });
	}

	function graphToList(graph: Graph): Post[] {
		console.log(graph, "graph")
		const nodes = Object.keys(graph).map((index) => graph[index]);
		const notDeleted = nodes.filter((node) => typeof node.post !== "string"); // filter out deleted posts
		return notDeleted
			.map((node) => {
				const revisions = node.children["1"].children; // look at the post revisions and choose the latest version to display
				const last = Object.keys(revisions).reduce(
					(acc, cur) => (parseInt(acc) > parseInt(cur) ? acc : cur),
					"0"
				);
				const indexString = revisions[last].post.index.split("/")[1];
				return {
					index: BigInt(indexString),
					contents: revisions[last].post.contents,
					author: revisions[last].post.author,
					date: revisions[last].post["time-sent"],
					revisions: revisions,
				};
			})
			.reverse(); // graphs are already ordered descending by index, reverse it so new notes show up first
	}

	function select(post: Post) {
		// make the new-post composer become an edit box when clicked on a post; restore when clicking again on the same post
		if (selected?.index === post.index) {
			setSelected(null);
			setTitle("");
			setText("");
		} else {
			setSelected(post);
			setTitle((post.contents[0] as TextContent).text);
			setText((post.contents[1] as TextContent).text);
		}
	}

	return (
		<div className="notebook">
			<header>
				<h1>~</h1>
			</header>
			<div className="composer">
				<div className="row-1">
					<input
						type="text"
						value={articleUrl}
						placeholder="Article URL"
						onChange={(e) => setArticleUrl(e.target.value)}
					/>
					<br />
					{!selected && <button onClick={extractArticle}>Extract</button>}
					{/* {selected && <button onClick={editPost}>Edit post</button>} */}
				</div>
				<br />
				<br />

				<div className="row-1">
					<input
						type="text"
						value={title}
						placeholder="Note Title"
						onChange={(e) => setTitle(e.target.value)}
					/>
					{!selected && <button onClick={addNotebookPost}>New post</button>}
					{selected && <button onClick={editPost}>Edit post</button>}
				</div>
				<textarea
					rows={10}
					value={text}
					onChange={(e) => setText(e.target.value)}
				></textarea>
				{loading && spinner}
			</div>
			<br />
			<div className="post-list">
				{/* <div className="post-preview post-preview-header">
					<div className="post-preview-title">
						<p>Note Title</p>
					</div>
					<div className="post-preview-date">
						<p>Last Modified</p>
					</div>
				</div> */}
				{graphToList(posts).map((post: Post) => {
					return <PostPreview key={`${post.index}`} post={post} select={select} />;
				})}
			</div>
		</div>
	);
}
export default Notebook;

interface PostProps {
	post: Post;
	select: (post: Post) => void;
}
function PostPreview(props: PostProps) {
	function showPost() {
		props.select(props.post);
	}
	return (
		<div className="post-preview">
			<div onClick={showPost} className="post-preview-title">
				<a>
					{(props.post.contents[0] as TextContent).text} - 
					<span>
						<small><code> {new Date(props.post.date).toLocaleDateString()}</code></small>
					</span>
				</a>
			</div>
			<div className="post-preview-date">
				{/* <p>{new Date(props.post.date).toLocaleTimeString()}</p> */}
			</div>
		</div>
	);
}
