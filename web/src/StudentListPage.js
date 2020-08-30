import React from "react";
import {Button, Col, Popconfirm, Row, Table} from 'antd';
import moment from "moment";
import * as Setting from "./Setting";
import * as StudentBackend from "./backend/StudentBackend";

class StudentListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      students: null,
    };
  }

  componentWillMount() {
    this.getStudents();
  }

  getStudents() {
    StudentBackend.getStudents("admin")
      .then((res) => {
        this.setState({
          students: res,
        });
      });
  }

  newStudent() {
    return {
      owner: "admin", // this.props.account.username,
      name: `student_${this.state.students.length}`,
      createdTime: moment().format(),
      realName: "James Bond",
      school: "Harvard University",
      program: "summer2020",
      mentor: "alice",
      github: "jamesbond",
      email: "jamesbond@gmail.com",
    }
  }

  addStudent() {
    const newStudent = this.newStudent();
    StudentBackend.addStudent(newStudent)
      .then((res) => {
          Setting.showMessage("success", `Student added successfully`);
          this.setState({
            students: Setting.prependRow(this.state.students, newStudent),
          });
        }
      )
      .catch(error => {
        Setting.showMessage("error", `Student failed to add: ${error}`);
      });
  }

  deleteStudent(i) {
    StudentBackend.deleteStudent(this.state.students[i])
      .then((res) => {
          Setting.showMessage("success", `Student deleted successfully`);
          this.setState({
            students: Setting.deleteRow(this.state.students, i),
          });
        }
      )
      .catch(error => {
        Setting.showMessage("error", `Student failed to delete: ${error}`);
      });
  }

  renderTable(students) {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '120px',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, record, index) => {
          return (
            <a href={`/user/${text}`}>{text}</a>
          )
        }
      },
      {
        title: 'Real Name',
        dataIndex: 'realName',
        key: 'realName',
        width: '150px',
        sorter: (a, b) => a.realName.localeCompare(b.realName),
      },
      {
        title: 'Created Time',
        dataIndex: 'createdTime',
        key: 'createdTime',
        width: '160px',
        sorter: (a, b) => a.createdTime.localeCompare(b.createdTime),
        render: (text, record, index) => {
          return Setting.getFormattedDate(text);
        }
      },
      {
        title: 'School',
        dataIndex: 'school',
        key: 'school',
        // width: '150px',
        sorter: (a, b) => a.school.localeCompare(b.school),
      },
      {
        title: 'Program',
        dataIndex: 'program',
        key: 'program',
        width: '120px',
        sorter: (a, b) => a.program.localeCompare(b.program),
        render: (text, record, index) => {
          return (
            <a href={`/programs/${text}`}>{text}</a>
          )
        }
      },
      {
        title: 'Mentor',
        dataIndex: 'mentor',
        key: 'mentor',
        width: '120px',
        sorter: (a, b) => a.mentor.localeCompare(b.mentor),
        render: (text, record, index) => {
          return (
            <a href={`/user/${text}`}>{text}</a>
          )
        }
      },
      {
        title: 'GitHub',
        dataIndex: 'github',
        key: 'github',
        width: '120px',
        sorter: (a, b) => a.github.localeCompare(b.github),
        render: (text, record, index) => {
          return (
            <a target="_blank" href={`https://github.com/${text}`}>{text}</a>
          )
        }
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: '120px',
        sorter: (a, b) => a.email.localeCompare(b.email),
        render: (text, record, index) => {
          return (
            <a href={`mailto:${text}`}>{text}</a>
          )
        }
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'op',
        width: '160px',
        render: (text, record, index) => {
          return (
            <div>
              <Button style={{marginTop: '10px', marginBottom: '10px', marginRight: '10px'}} type="primary" onClick={() => Setting.goToLink(`/students/${record.name}`)}>Edit</Button>
              <Popconfirm
                title={`Sure to delete student: ${record.name} ?`}
                onConfirm={() => this.deleteStudent(index)}
                disabled={!Setting.isAdminUser(this.props.account)}
              >
                <Button style={{marginBottom: '10px'}} type="danger" disabled={!Setting.isAdminUser(this.props.account)}>Delete</Button>
              </Popconfirm>
            </div>
          )
        }
      },
    ];

    return (
      <div>
        <Table columns={columns} dataSource={students} rowKey="name" size="middle" bordered pagination={{pageSize: 100}}
               title={() => (
                 <div>
                   Students&nbsp;&nbsp;&nbsp;&nbsp;
                   <Button type="primary" size="small" disabled={!Setting.isAdminUser(this.props.account)} onClick={this.addStudent.bind(this)}>Add</Button>
                 </div>
               )}
               loading={students === null}
        />
      </div>
    );
  }

  render() {
    return (
      <div>
        <Row style={{width: "100%"}}>
          <Col span={1}>
          </Col>
          <Col span={22}>
            {
              this.renderTable(this.state.students)
            }
          </Col>
          <Col span={1}>
          </Col>
        </Row>
      </div>
    );
  }
}

export default StudentListPage;