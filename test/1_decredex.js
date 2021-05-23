const truffleAssert = require('truffle-assertions')

const Decredex = artifacts.require('../contracts/Decredex')



contract('Decredex', async (accounts) => {
  var decredex

  const zero_addr = '0x0000000000000000000000000000000000000000'
  const owner = accounts[0] // This is the owner address
  const institution = accounts[1]
  const government = accounts[2]
  const workplace = accounts[3]
  const student1 = accounts[4]
  const student2 = accounts[5]
  const student3 = accounts[6]

  describe('constructor()', () => {
    before("Deploying Decredex contract", async () => {
      decredex = await Decredex.new(institution, student1, student2, student3)
    })

    it("Decredex contract deploys", async () => {
      assert.ok(decredex)
    })
  })

  describe('registerCourse()', async () => {
    before("Deploying Decredex contract", async () => {
      decredex = await Decredex.new(institution, student1, student2, student3)
    })

    it("Should register a course", async () => {
      const tx1 = await decredex.registerCourse("B4SD", "Blockchain 4 dummies", 0, {from: institution})
      await truffleAssert.eventEmitted(tx1, "DECREDEX_COURSE_REGISTERED")
    })
    it("Should not register existing course", async () => {
      await truffleAssert.reverts(decredex.registerCourse("B4SD", "Blockchain 4 dummies", 0, {from: institution}))
    })
  })


  describe('enrollStudent()', async () => {
    before("Deploying and initializing Decredex contract", async () => {
      decredex = await Decredex.new(institution, student1, student2, student3)
      const tx1 = await decredex.registerCourse("B4SD", "Blockchain 4 dummies", 0, {from: institution})
      await truffleAssert.eventEmitted(tx1, "DECREDEX_COURSE_REGISTERED")
    })

    it("Should enroll student", async () => {
      const tx1 = await decredex.enrollStudent(student1, "B4SD", {from: institution})
      await truffleAssert.eventEmitted(tx1, "DECREDEX_STUDENT_ENROLLED")
    })
    it("Should not enroll already enrolled student", async () => {
      await truffleAssert.reverts(decredex.enrollStudent(student1, "B4SD", {from: institution}))
    })
    it("Should not enroll student with wrong account", async () => {
      await truffleAssert.reverts(decredex.enrollStudent(student2, "B4SD", {from: workplace}))
    })
    it("Should not enroll student to unknown course", async () => {
      await truffleAssert.reverts(decredex.enrollStudent(student2, "B2D", {from: institution}))
    })
  })

  describe('completeStudent()', async () => {
    before("Deploying and initializing Decredex contract", async () => {
      decredex = await Decredex.new(institution, student1, student2, student3)
      const tx1 = await decredex.registerCourse("B4SD", "Blockchain 4 dummies", 0, {from: institution})
      await truffleAssert.eventEmitted(tx1, "DECREDEX_COURSE_REGISTERED")
      const tx2 = await decredex.enrollStudent(student1, "B4SD", {from: institution})
      await truffleAssert.eventEmitted(tx2, "DECREDEX_STUDENT_ENROLLED")
    })

    it("Should complete student enrollment", async () => {
      const tx1 = await decredex.queryStudent(student1)
      assert.equal(tx1[0], student1)
      assert.equal(tx1[2].length, 1)
      assert.equal(tx1[3].length, 0)

      const tx2 = await decredex.completeStudent(student1, "B4SD", {from: institution})
      await truffleAssert.eventEmitted(tx2, "DECREDEX_STUDENT_COMPLETED")

      const tx3 = await decredex.queryStudent(student1)
      assert.equal(tx3[0], student1)
      assert.equal(tx3[2].length, 0)
      assert.equal(tx3[3].length, 1)
    })
    it("Should not complete student enrollment if not already enrolled", async () => {
      await truffleAssert.reverts(decredex.completeStudent(student2, "B4SD", {from: institution}))
    })
    it("Should not complete student enrollment with wrong account", async () => {
      await truffleAssert.reverts(decredex.completeStudent(student2, "B4SD", {from: workplace}))
    })
    it("Should not complete student enrollment to unknown course", async () => {
      await truffleAssert.reverts(decredex.completeStudent(student2, "B2D", {from: institution}))
    })
  })

  describe('queryCourse()', async () => {
    before("Deploying and initializing Decredex contract", async () => {
      decredex = await Decredex.new(institution, student1, student2, student3)
      const tx1 = await decredex.registerCourse("B4SD", "Blockchain 4 dummies", 0, {from: institution})
      await truffleAssert.eventEmitted(tx1, "DECREDEX_COURSE_REGISTERED")
      const tx2 = await decredex.enrollStudent(student1, "B4SD", {from: institution})
      await truffleAssert.eventEmitted(tx2, "DECREDEX_STUDENT_ENROLLED")
      const tx3 = await decredex.enrollStudent(student2, "B4SD", {from: institution})
      await truffleAssert.eventEmitted(tx3, "DECREDEX_STUDENT_ENROLLED")
    })

    it("Should query known course", async () => {
      const course = await decredex.queryCourse("B4SD")
      assert.equal(course[0], "B4SD")
      assert.equal(course[1], "Blockchain 4 dummies")
      assert.equal(course[2], institution)
      assert.equal(course[3], 0)
      assert.equal(course[4].length, 2)
      assert.equal(course[5].length, 0)
    })
    it("Should not query unknown course", async () => {
      await truffleAssert.reverts(decredex.queryCourse("B2D"))
    })
  })

  describe('queryStudent()', async () => {
    before("Deploying and initializing Decredex contract", async () => {
      decredex = await Decredex.new(institution, student1, student2, student3)
      const tx1 = await decredex.registerCourse("B4SD", "Blockchain 4 dummies", 0, {from: institution})
      await truffleAssert.eventEmitted(tx1, "DECREDEX_COURSE_REGISTERED")
      const tx2 = await decredex.registerCourse("B2D", "Blockchain 2 dummies", 0, {from: institution})
      await truffleAssert.eventEmitted(tx2, "DECREDEX_COURSE_REGISTERED")
      const tx3 = await decredex.enrollStudent(student1, "B4SD", {from: institution})
      await truffleAssert.eventEmitted(tx3, "DECREDEX_STUDENT_ENROLLED")
      const tx4 = await decredex.enrollStudent(student1, "B2D", {from: institution})
      await truffleAssert.eventEmitted(tx4, "DECREDEX_STUDENT_ENROLLED")
    })

    it("Should query known student", async () => {
      const student = await decredex.queryStudent(student1)
      assert.equal(student[0], student1)
      assert.equal(student[1], "Student 1")
      assert.equal(student[2].length, 2)
      assert.equal(student[3].length, 0)
    })
    it("Should not query unknown student", async () => {
      await truffleAssert.reverts(decredex.queryStudent(zero_addr))
    })
  })
})
