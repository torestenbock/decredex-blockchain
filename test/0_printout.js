contract('Test Information', async (accounts) => {
  // Define some users
  const zero_addr = '0x0000000000000000000000000000000000000000'
  const owner = accounts[0] // This is the owner address
  const institution = accounts[1]
  const government = accounts[2]
  const workplace = accounts[3]
  const student1 = accounts[4]
  const student2 = accounts[5]
  const student3 = accounts[6]

  // Print out available account information (useful for truffle test printouts)
  console.log("   Addresses used for testing:")
  console.log("   Zero Addr:    " + zero_addr)
  console.log("   Owner:        " + owner)
  console.log("   Institution:  " + institution)
  console.log("   Government:   " + government)
  console.log("   Workplace:    " + workplace)
  console.log("   Student1:     " + student1)
  console.log("   Student2:     " + student2)
  console.log("   Student3:     " + student3)
})
