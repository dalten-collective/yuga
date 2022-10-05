import "./App.css"
import { Box, Row, StatelessTextInput, Text, Center, Button, BaseInput } from "@tlon/indigo-react";

import { useState, useEffect } from 'react'

// const [ship, setShip] = useState('');
// const [code, setCode] = useState('');
// const [url, setUrl] = useState('');

interface LoginProps {
	ship: string;
	setShip: (ship: string) => void;
	code: string;
	setCode: (code: string) => void;
	url: string;
	setUrl: (url: string) => void;
	setUrbit: () => void;
}

function Old(props) {
	return (
		<div className="composer">
			<div className="row-1">
				<input
					type="text"
					value={props.ship}
					placeholder="Ship name"
					onChange={(e) => props.setShip(e.target.value)}
				/>
				<br />
				<input
					type="text"
					value={props.url}
					placeholder="Ship URL"
					onChange={(e) => props.setUrl(e.target.value)}
				/>
				<br />
				{/* Hide code */}
				<input
					type="password"
					value={props.code}
					placeholder="+code"
					onChange={(e) => props.setCode(e.target.value)}
				/>
				<br />
				<br />
				<button className="create-button" onClick={props.setUrbit}>Connect Urbit</button>
			</div>
		</div>
	)
}
function LoginForm(props : LoginProps) {
	return (
		<Box p="0">
			<Row
				justifyContent="center"
				alignItems="center"
			//   borderBottom="1px solid rgba(0, 0, 0, 0.1)"
			>
				<Box>
					<p className="logotext">
						Cyclopaedia
					</p>
					<p>
						Log in, drop out.
					</p>
				</Box>
			</Row>
			<Row
				justifyContent="center"
				alignItems="center"
			//   borderBottom="1px solid rgba(0, 0, 0, 0.1)"
			>
				{/* <Box p={3}>
			  <Box>
				  <Text color="white" fontSize={2}>
					  Cyclopaedia
				  </Text>
			  </Box>
		  </Box> */}
				<Box p="0">
					<StatelessTextInput
						className="input"
						color={"white"}
						value={props.ship}
						placeholder="Ship name"
						backgroundColor="rgba(0, 0, 0, 0.04)"
						borderColor={"#c3bdbda5"}
						borderRadius="8px"
						fontWeight={400}
						height={40}
						width={256}
						onChange={(e) => props.setShip(e.target.value)}
					/>
					<br />
					<StatelessTextInput
						className="input"
						color={"white"}
						value={props.url}
						placeholder="Ship URL"
						backgroundColor="rgba(0, 0, 0, 0.04)"
						borderColor={"#c3bdbda5"}
						borderRadius="8px"
						fontWeight={400}
						height={40}
						width={256}
						onChange={(e) => props.setUrl(e.target.value)}
					/>
					<br />
					<StatelessTextInput
						className="input"
						type={"password"}
						color={"white"}
						value={props.code}
						placeholder="+code"
						backgroundColor="rgba(0, 0, 0, 0.04)"
						borderColor={"#c3bdbda5"}
						borderRadius="8px"
						fontWeight={400}
						height={40}
						width={256}
						onChange={(e) => props.setCode(e.target.value)}
					/>
					<br />
					<button className="create-button" onClick={props.setUrbit}>Connect Urbit</button>
				</Box>
			</Row>
		</Box>
	);
}

export default LoginForm