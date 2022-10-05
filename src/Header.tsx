import { Box, Row, StatelessTextInput, Text, Center, Button } from "@tlon/indigo-react";

function Header () {
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
				  placeholder="Ship name"
				  backgroundColor="rgba(0, 0, 0, 0.04)"
				  borderColor={"#c3bdbda5"}
				  borderRadius="8px"
				  fontWeight={400}
				  height={40}
				  width={256}
			  />
			  <br />
			  <StatelessTextInput
				  className="input"
				  color={"white"}
				  placeholder="Ship URL"
				  backgroundColor="rgba(0, 0, 0, 0.04)"
				  borderColor={"#c3bdbda5"}
				  borderRadius="8px"
				  fontWeight={400}
				  height={40}
				  width={256}
			  />
			  <br />
			  <StatelessTextInput
				  className="input"
				  type={"password"}
				  color={"white"}
				  placeholder="+code"
				  backgroundColor="rgba(0, 0, 0, 0.04)"
				  borderColor={"#c3bdbda5"}
				  borderRadius="8px"
				  fontWeight={400}
				  height={40}
				  width={256}
			  />
			<br />
			<button className="create-button">Connect Urbit</button>
		  </Box>
	  </Row>
	</Box>
  );
}

export default Header;