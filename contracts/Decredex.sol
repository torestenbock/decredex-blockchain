pragma solidity >=0.4.22 <0.9.0;



contract Decredex {

  event DECREDEX_COURSE_REGISTERED      (string code);
  event DECREDEX_STUDENT_ENROLLED       (string code, address student);
  event DECREDEX_STUDENT_COMPLETED      (string code, address student);



  struct Student {
    bool exist;
    address id;
    string name;
    string[] courses;
    uint256 enrolledCourses;
    mapping(string => bool) enrollments; // Course code the student is enrolled in
    string[] completions; // Course code the student has completed
  }
  mapping(address => Student) private students; // All students registry

  struct Course {
    bool exist;
    string code;
    string name;
    address institution;
    uint256 credits; // Integer representation of two decimal float (divide by 100 in frontend)
    address[] students;
    uint256 enrolledStudents;
    mapping(address => bool) enrollments;
    address[] completions; // Students that have completed this course
  }
  mapping(string => Course) private courses; // All courses registry



  constructor(
    address _institution,
    address _student1,
    address _student2,
    address _student3
  ) {
    Course storage course1 = courses["B4D"];
    course1.exist = true;
    course1.code = "B4D";
    course1.name = "Blockchain 4 dummies";
    course1.institution = _institution;
    course1.credits = 0;

    Course storage course2 = courses["TKN101"];
    course2.exist = true;
    course2.code = "TKN101";
    course2.name = "Tokenomics 101";
    course2.institution = _institution;
    course2.credits = 750;

    Student storage newStudent1 = students[_student1];
    newStudent1.exist = true;
    newStudent1.id = _student1;
    newStudent1.name = "Student 1";

    Student storage newStudent2 = students[_student2];
    newStudent2.exist = true;
    newStudent2.id = _student2;
    newStudent2.name = "Student 2";

    Student storage newStudent3 = students[_student3];
    newStudent3.exist = true;
    newStudent3.id = _student3;
    newStudent3.name = "Student 3";
  }



  function registerCourse(
    string memory _code,
    string memory _name,
    uint256 _credits // Integer representation of two decimal float (multiplied by 100 in frontend)
  )
  public
  returns(bool) {
    require(!courses[_code].exist, "Course already registered"); // Make sure course with code not already registered

    Course storage newCourse = courses[_code];
    newCourse.exist = true;
    newCourse.code = _code;
    newCourse.name = _name;
    newCourse.institution = msg.sender;
    newCourse.credits = _credits;

    emit DECREDEX_COURSE_REGISTERED(_code);
    return(true);
  }

  function queryCourse(
    string memory _code
  )
  public view
  returns(string memory, string memory, address, uint256, address[] memory, address[] memory) {
    require(courses[_code].exist, "Queried course must be registered"); // Make sure course with code not already registered

    uint256 index = 0;
    address[] memory _enrolledStudents = new address[](courses[_code].enrolledStudents);
    for (uint i = 0; i < courses[_code].students.length; i++) {
      if(courses[_code].enrollments[courses[_code].students[i]]) {
        _enrolledStudents[index] = courses[_code].students[i];
        index++;
      }
    }

    return(
      courses[_code].code,
      courses[_code].name,
      courses[_code].institution,
      courses[_code].credits,
      _enrolledStudents,
      courses[_code].completions
    );
  }

  function queryStudent(
    address _student
  )
  public view
  returns(address, string memory, string[] memory, string[] memory) {
    require(students[_student].exist, "Queried student must exist"); // Make sure course with code not already registered

    uint256 index = 0;
    string[] memory _enrolledCourses = new string[](students[_student].enrolledCourses);
    for (uint i = 0; i < students[_student].courses.length; i++) {
      if(students[_student].enrollments[students[_student].courses[i]]) {
        _enrolledCourses[index] = students[_student].courses[i];
        index++;
      }
    }

    return(
      students[_student].id,
      students[_student].name,
      _enrolledCourses,
      students[_student].completions
    );
  }



  function enrollStudent(
    address _student,
    string memory _code
  )
  public
  returns(bool) {
    require(courses[_code].exist, "Course must be registered"); // Make sure course with code not already registered
    require(msg.sender == courses[_code].institution, "Only owner institution can enroll students to course");
    require(!courses[_code].enrollments[_student], "Student can not already be enrolled");
    require(!students[_student].enrollments[_code], "Student can not already be enrolled");

    Course storage course = courses[_code];
    Student storage student = students[_student];

    course.students.push(_student);
    course.enrolledStudents += 1;
    course.enrollments[_student] = true;

    student.courses.push(_code);
    student.enrolledCourses += 1;
    student.enrollments[_code] = true;

    emit DECREDEX_STUDENT_ENROLLED(_code, _student);
    return(true);
  }

  function completeStudent(
    address _student,
    string memory _code
  )
  public
  returns(bool) {
    require(courses[_code].exist, "Course must be registered"); // Make sure course with code not already registered
    require(msg.sender == courses[_code].institution, "Only owner institution can enroll students to course");
    require(courses[_code].enrollments[_student], "Student must already be enrolled");
    require(students[_student].enrollments[_code], "Student must already be enrolled");

    Course storage course = courses[_code];
    course.enrolledStudents -= 1;
    course.enrollments[_student] = false;
    course.completions.push(_student);

    Student storage student = students[_student];
    student.enrolledCourses -= 1;
    student.enrollments[_code] = false;
    student.completions.push(_code);

    emit DECREDEX_STUDENT_COMPLETED(_code, _student);
    return(true);
  }
}
