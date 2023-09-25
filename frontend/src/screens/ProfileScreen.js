import React, { useState } from 'react'
import {Row, Col, Nav} from "react-bootstrap";
import PersonalInformation from 'components/pages/profile/PersonalInformation';
import Orders from 'components/pages/profile/Orders';
import Meta from 'components/Meta';


function ProfileScreen() {
  const [selectedTab, setSelectedTab] = useState("profile");

  
  const handleSelectTab = (eventKey) => {
    setSelectedTab(eventKey)
  }

  const componentsTabs = {
    "profile": <PersonalInformation></PersonalInformation>,
    "orders": <Orders></Orders>
  }
  return (
    <Row>
      <Meta title={`Mi Información Personal`}></Meta>
      <Col md={4}>
        <Nav variant="pills" activeKey={selectedTab} className="flex-column" onSelect={handleSelectTab}>
          <Nav.Link eventKey="profile">My Personal Information</Nav.Link>
          <Nav.Link eventKey="orders">My Orders</Nav.Link>
        </Nav>
      </Col>
      <Col md={{span: 7, offset: 1}}>
        {componentsTabs[selectedTab]}
      </Col>
    </Row>
  )
}

export default ProfileScreen