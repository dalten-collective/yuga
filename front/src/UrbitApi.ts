import Urbit from '@urbit/http-api'
import { useState, useEffect } from 'react'

function handleSuccess() {
	console.log("Success!");
}

function handleError() {
	console.log("Error!");
}

export const connectUrbit = async (ship, url, code) => {
	const urbit = await Urbit.authenticate({
		ship: ship,
		url: url,
		code: code,
		verbose: true
	});

	return urbit;
}

async function doPoke(ship, code) {
	const urbit = await Urbit.authenticate({
		ship: "lorweb-fognem-binput-posnec--monhex-bolsug-dilnev-binzod",
		url: "http://localhost:80",
		code: code,
		verbose: true
	});
	console.log('Connected!');
	console.log(urbit);

	urbit.poke({
		app: "hood",
		mark: "helm-hi",
		json: "jojojo!",
		onSuccess: handleSuccess,
		onError: handleError
	});
}

async function doScry() {
	const urbit = await Urbit.authenticate({
		ship: "lorweb-fognem-binput-posnec--monhex-bolsug-dilnev-binzod",
		url: "http://localhost:80",
		code: "siller-fammep-narner-moptug",
		verbose: true
	});
	console.log('Connected!');
	console.log(urbit);
	var groups = await urbit.scry({ app: "graph-store", path: "/keys" });
	console.log(groups);

}

async function runThread(ship) {
	const urbit = await Urbit.authenticate({
		ship: "lorweb-fognem-binput-posnec--monhex-bolsug-dilnev-binzod",
		url: "http://localhost:80",
		code: "siller-fammep-narner-moptug",
		verbose: true
	});
	urbit.desk = "landscape";
	console.log('Connected!');
	console.log(urbit);
	const body = {
		create: {
			resource: {
				ship: `~${ship}`,
				name: "cyclopaedia",
			},
			title: "My Urbit Notes",
			description: "My Awesome Private Urbit Notebook",
			associated: {
				policy: {
					invite: { pending: [] },
				},
			},
			module: "publish",
			mark: "graph-validator-publish",
		},
	};
	var thread = await urbit.thread({
		inputMark: "graph-view-action",
		outputMark: "json",
		threadName: "graph-create",
		body: body,
	});
	console.log(thread);

}
