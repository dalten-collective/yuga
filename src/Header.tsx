import { Box, Row, StatelessTextInput, Text, Center } from "@tlon/indigo-react";

function Header () {
  return (
	<Center>
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
		  <Box p="12px">
			  <StatelessTextInput
				  className="input"
				  color={"white"}
				  placeholder="Ship Name"
				  backgroundColor="rgba(0, 0, 0, 0.04)"
				  borderRadius="4px"
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
				  borderRadius="4px"
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
				  borderRadius="4px"
				  fontWeight={400}
				  height={40}
				  width={256}
			  />
		  </Box>
	  </Row>
	</Center>
  );
}

export default Header;