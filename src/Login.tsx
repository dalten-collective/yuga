import "./App.css"
// import { useState, useEffect } from 'react'

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

function LoginForm(props) {
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

export default LoginForm