import "./App.css";
// import { useState, useEffect, useReducer } from "react";

function Debug(props) {

  // const api = props.api;
	// useEffect(() => {
	// 	const api = props.api;
	// 	api	
	// 	// urbitVisor
	// 		.scry({
	// 			app: "graph-store",
	// 			path: `/graph/~${props.ship}/cyclopaedia`,
	// 		})
	// 		.then((res) => {
	// 			console.log(res, "scried")
	// 			setPosts({
	// 				type: "add-post",
	// 				payload: res["graph-update"]["add-graph"]["graph"],
	// 			});
	// 			setLoading(false);
	// 		});
	// 	// api.onOpen(handleAddNodes);
	// 	// urbitVisor.on("sse", ["graph-update", "add-nodes"], handleAddNodes);
	// 	// urbitVisor.on("sse", ["graph-update", "remove-posts"], handleRemovePosts);
	// 	api.subscribe({ app: "graph-store", path: "/updates", event: handleUpdate});
	// }, []);


	return (
    <div>
      <h1>Debug</h1>
      <div>
          Things
      </div>
    </div>
	);
}
export default Debug;

