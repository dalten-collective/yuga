import "./App.css";
import { useState, useEffect, useReducer } from "react";
import { urbitVisor } from "@dcspark/uv-core";
import type { Graph, Post, Content, TextContent } from "./types";
import Spinner from "./Spinner";
import { extract } from 'article-parser'
import TurndownService from 'turndown'
import {
	LoadingSpinner,
	Center,
	Table,
	Tr,
	Td,
	Box,
	Row,
	Icon,
	Col,
	StatelessTextArea,
	StatelessTextInput,
	Text
} from '@tlon/indigo-react';
import { justifyContent } from "styled-system";
import Markdown from 'markdown-to-jsx';
import cyclogo from './assets/cyclogo.png'

interface NotebookProps {
	ship: string; // ship name
	api: any;
}

function Notebook(props: NotebookProps) {
	function handleUpdate(event) {
		// Check if add-nodes or remove-nodes
		if (event['graph-update']['add-nodes']) {
			handleAddNodes(event['graph-update']['add-nodes']);
		}
		if (event['graph-update']['remove-nodes']) {
			handleRemovePosts(event['graph-update']['remove-nodes']);
		}
	}

	const api = props.api;
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
		// api.onOpen(handleAddNodes);
		// urbitVisor.on("sse", ["graph-update", "add-nodes"], handleAddNodes);
		// urbitVisor.on("sse", ["graph-update", "remove-posts"], handleRemovePosts);
		api.subscribe({ app: "graph-store", path: "/updates", event: handleUpdate});
	}, []);

	function refreshPosts() {
		api
			.scry({
				app: "graph-store",
				path: `/graph/~${props.ship}/cyclopaedia`,
			})
			.then((res) => {
				setPosts({
					type: "add-post",
					payload: res["graph-update"]["add-graph"]["graph"],
				});
				setLoading(false);
			});
	}

	function extractArticleBackup() {
		const encodedUrl = encodeURIComponent(articleUrl);
		const reqUrl = "https://extract-article.deta.dev/?url=" + encodedUrl;
		
		fetch(reqUrl, {method: 'GET', redirect: 'follow'})
		.then(response => response.json())
		.then(result => {
			console.log(result.data);
			const turndownService = new TurndownService();
			var content = turndownService.turndown(result.data.content);
			var title = result.data.title;
			setTitle(title);
			setText(content);
			setLoading(false);
			})
			.catch(error => console.log('error', error));
	}

	function extractArticle() {
		var td = new TurndownService();
		setLoading(true);
		extract(articleUrl)
			.then((article) => {
				// var content = turndown(article.content);

				var content = td.turndown(article.content);
				var title = article.title;
				setTitle(title);
				console.log(article, "AAAAAAAAAAAAAAA");
				if (content.length <= 0) {
					setLoading(true);
				} else {
					setLoading(false);
				}
				setText(content);
				console.log(td.turndown(article.content), "content")
				// document.body.innerHTML = article.content;
			})
			.catch((err) => {
				setLoading(true);
				extractArticleBackup();
			});
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
	const [articleUrl, setArticleUrl] = useState("https://groups.csail.mit.edu/medg/people/psz/Licklider.html");
	const [title, setTitle] = useState("");
	const [text, setText] = useState("");
	const [selected, setSelected] = useState<Post>(null);
	const [composer, setComposer] = useState(false);
	const [view, setView] = useState(false);

	// console.log(graphToList(posts), "posts");

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
		const api = props.api;
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
		api
			.poke({ app: "graph-store", mark: "graph-update-3", json: body })
			.then((res) => console.log(res, "ADD POST RES"));
		refreshPosts();
		// setComposer(false);
		refreshView();
	};

	function editPost() {
		if (title === "" && text === "") deletePost();
		else modifyPost();
	};
	function deletePost() {
		// const api = props.api;
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
		api
			.poke({ app: "graph-store", mark: "graph-update-3", json: body })
			.then((res) => console.log(res));

		refreshPosts();
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
		api
			.poke({ app: "graph-store", mark: "graph-update-3", json: body })
			.then((res) => console.log(res));

		refreshPosts();
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
		// console.log(graph, "graph")
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
			// console.log(post, "post")
			setTitle((post.contents[0] as TextContent).text);
			setText((post.contents[1] as TextContent).text);
		}
	}

	function refreshView() {
		setSelected(null);
		setComposer(false);
		refreshPosts();
	}

	function compose() {
		setComposer(true);
		refreshPosts();
	}

	return (
		<Box className="center" width={"980px"} alignItems="center" justifyContent="center">
			{/* Exit button */}
			<Box
				className="absolute"
				position={"fixed"}
				top="0"
				left="10px"
				mt="3"
				ml="3"
			>
				<img className="logo" width={40} src={cyclogo} alt="cyclopaedia" />
			</Box>
			{selected && (
				<Box
					className="absolute"
					position={"fixed"}
					top="0"
					right="10px"
					mt="3"
					mr="3"
				>
					<button onClick={refreshView}>x</button>
				</Box>
			)}
			{!selected && !composer && (
				<Box
					className="absolute"
					position={"fixed"}
					top="0"
					right="10px"
					mt="3"
					mr="3"
				>
					<button onClick={compose}>
						<Text>New post</Text>
					</button>
				</Box>
			)}
			{composer && (
				<>
				<Box
					className="absolute"
					position={"fixed"}
					top="0"
					right="10px"
					mt="3"
					mr="3"
				>
					<button onClick={refreshView}>x</button>
				</Box>
				<Row className="text-center" justifyContent={"center"} alignItems="center">
					{!loading && (
						<h1>~</h1>
						)}
					{loading && (
						<Box>
							<LoadingSpinner
								width='36px'
								height='36px'
								foreground='rgba(0, 0, 0, 0.6)'
								background='rgba(0, 0, 0, 0.2)'
								/>
							<br />
						</Box>
					)}
				</Row>
				<Row className="row-1 text-center" justifyContent={"center"} alignItems="center">
					<Box>
						<StatelessTextInput
							fontFamily={"Inter"}
							className="input"
							// color={"white"}
							value={articleUrl}
							placeholder="Note title"
							backgroundColor="rgba(0, 0, 0, 0.04)"
							borderColor={"#c3bdbda5"}
							borderRadius="8px"
							fontWeight={400}
							height={40}
							width={256}
							onChange={(e) => setArticleUrl(e.target.value)}
							/>
					<br />
					{!selected && <button onClick={extractArticle}>Extract</button>}
					</Box>
				</Row>
				<br />
				<br />
				<Box justifyContent={"center"}>
					<Row justifyContent={'space-between'} pb='10px'>
						<StatelessTextInput
							className="input"
							fontFamily={"Inter"}
							// color={"white"}
							value={title}
							placeholder="Note title"
							backgroundColor="rgba(0, 0, 0, 0.04)"
							borderColor={"#c3bdbda5"}
							borderRadius="8px"
							fontWeight={400}
							height={40}
							width={256}
							onChange={(e) => setTitle(e.target.value)}
							/>
						{!selected && <button onClick={addNotebookPost}>New post</button>}
						{selected && <button onClick={editPost}>Edit post</button>}
						{selected && <button onClick={deletePost}>Delete post</button>}
					</Row>
					<Row>
						<StatelessTextArea
							className="input"
							backgroundColor="rgba(0, 0, 0, 0.04)"
							fontFamily={"'Source Code Pro', monospace"}
							// className="inter"
							borderColor={"#c3bdbda5"}
							// width={"512px"}
							borderRadius="8px"
							height={256}
							// color="white"
							fontWeight={400}
							rows={10}
							value={text}
							onChange={(e) => setText(e.target.value)}	
							>
						</StatelessTextArea>
					</Row>

				</Box>
				{loading && (
					<Box>
						<br />
						<LoadingSpinner
							width='36px'
							height='36px'
							foreground='rgba(0, 0, 0, 0.6)'
							background='rgba(0, 0, 0, 0.2)'
							/>	
					</Box>
				)}
				<br />
				</>
			)}

			{selected && <Markdown>{text}</Markdown>}

			{!composer && !selected && (
				<Box className="post-list">
					{graphToList(posts).map((post: Post) => {
						return <PostPreview key={`${post.index}`} post={post} select={select} setView={setView} />;
					})}
				</Box>
			)}
		</Box>
	);
}
export default Notebook;

interface PostProps {
	post: Post;
	setView: (view: boolean) => void;
	select: (post: Post) => void;
}
function PostPreview(props: PostProps) {
	// console.log(props.post)
	function showPost() {
		props.select(props.post);
		props.setView(true);
	}
	const title = (props.post.contents[0] as TextContent).text;
	const text = (props.post.contents[1] as TextContent).text;
	const date = new Date(props.post.date).toLocaleDateString();
	const textPreview = text.slice(0, 400) + (text.length > 400 ? " ..." : "");

	return (
		<Box p="1" pb="4em" pt="4em" className="post-preview-box" display="flex" flexDirection="column" height="100%">
			<Row justifyContent="space-between">
				<a onClick={showPost}>
					{title}
				</a>
				<small><code>~{props.post.author}</code></small>
			</Row>
			<Row justifyContent="space-between">
				{/* <small><code>{date}</code></small> */}
				<small><code>{date} {new Date(props.post.date).toLocaleTimeString()}</code></small>
			</Row>
			<br />
			<Row>
				<Markdown>{textPreview}</Markdown>
			</Row>
				{/* <small><code>{textPreview}</code></small> */}
				{/* <hr /> */}
				<br />
				<button onClick={showPost} className='show-more-btn'>
					{/* <Icon icon="Smiley" /> */}
					Show more
				</button>
		</Box>
	);
}

function PostContent(props: PostProps) {
	function showPost() {
		props.select(props.post);
	}

	const title = (props.post.contents[0] as TextContent).text;
	const text = (props.post.contents[1] as TextContent).text;
	const date = new Date(props.post.date).toLocaleDateString();
	const textPreview = text.slice(0, 400) + (text.length > 400 ? " ..." : "");
	
	return (
		<Box p="1" pb="4em" pt="4em" className="post-preview-box" display="flex" flexDirection="column" height="100%">
			<Row justifyContent="space-between">
				<a onClick={showPost}>
					{title}
				</a>
				<small><code>~{props.post.author}</code></small>
			</Row>
			<Row justifyContent="space-between">
				<small><code>{date} {new Date(props.post.date).toLocaleTimeString()}</code></small>
			</Row>
			<br />
			<Row>
				<Markdown>{text}</Markdown>
			</Row>
				{/* <small><code>{textPreview}</code></small> */}
				{/* <hr /> */}
				<br />
				<button onClick={showPost} className='show-more-btn'>Show more</button>
		</Box>
	);

}