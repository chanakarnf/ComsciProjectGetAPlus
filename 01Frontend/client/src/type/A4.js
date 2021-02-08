import React, { useState } from 'react'
import { Layout, Menu, Breadcrumb, Row, Col, Select, InputNumber, Upload, message, Button, Radio } from 'antd';
import 'antd/dist/antd.css';
import NavbarHead from '../page/NavbarHead'
import '../type/CSS/setComponent.css';
import btn from '../img/btn.png';
import { UploadOutlined } from '@ant-design/icons';
import { storage } from '../firebase';
import firebase from '../firebase'
import { getKeyThenIncreaseKey } from 'antd/lib/message';
const { Option } = Select;
const { Header, Content, Footer } = Layout;
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

const A4 = props => {
    // const [count, setCount] = useState(0)
    const [size, setSize] = useState(0)
    const [weight, setWeight] = useState(0) // paper
    const [quantity, setQuantity] = useState(1)
    const [color, setColor] = useState('color')
    const [url, setUrl] = useState(null)
    //img
    const [image, setImage] = useState(null)
    const [status, setStatus] = useState("รอการตรวจสอบ")
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState(null)
    const [progress, setProgress] = useState(0)
    const [statusUpload, setStatusUpload] = useState('')

    function handleChangeSize(value) {
        setSize(value)
        console.log(`selected ${value}`);
    }
    function handleChangeWeight(value) {
        setWeight(value)
        console.log(`selected ${value}`);
    }
    function handleChangeQuantity(value) {
        setQuantity(value)
        console.log(`selected ${value}`);
    }
    const img = {
        name: 'file',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(e) {
            // console.log(e.file, e.fileList);
            const image = e.file.originFileObj;
            setImage(image)
        }
    };
    function handleChangeColor(e) {
        setColor(e.target.value)
        console.log(e.target.value);
    }

    // อย่าลืม check ถ้ามันไม่ส่งค่าอะไรมาเลย 
    function handleSubmit(e) {
        e.preventDefault();
        console.log('Received values of form: ', e);
        console.log("image", image);
        if (image == null) {
            message.error("กรุณาอัพโหลดสลิป")
        } else {
            const uploadTask = storage.ref(`images/${image.name}`).put(image);
            uploadTask.on('state_changed',
                async (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    console.log("progress", progress);
                    if (progress !== 100) {
                        setStatusUpload('กรุณารอการอัพโหลดรูป')
                    }
                },
                (error) => {
                    console.log('error', error);
                },
                async () => {
                    // complete function ....
                    const urlfile = await storage.ref('images').child(image.name).getDownloadURL()
                    const payload = { size, weight, quantity, color, urlfile }
                    const res = await fetch('http://localhost:9000/calA4', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });
                   const json = await res.json()
                   console.log(json)
                });
        }
    }


    return (
        <div>
            <NavbarHead />
            <h1 id ="setCenterTitle">A4 PRINTING CALCULATOR</h1>
            <Row>
                <Col id = "setCenterAllComponent">
                    <Row>
                        <Col><div id = "setTextTopic">Size: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> </Col>
                        <Col>
                            <Select size={'large'} style={{ width: 300 }} onChange={handleChangeSize} placeholder="SIZE">
                                <Option value="a4">A4</Option>
                            </Select></Col>
                        <Col><div id = "setTextTopic"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Paper weight: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> </Col>
                        <Col>
                            <Select size={'large'} style={{ width: 300 }} onChange={handleChangeWeight} placeholder="Paper weight:">
                                <Option value="70">70 GSM</Option>
                                <Option value="80">80 GSM</Option>
                                <Option value="110">110 GSM</Option>
                                <Option value="120">120 GSM</Option>
                                <Option value="130">130 GSM</Option>
                                <Option value="150">150 GSM</Option>
                            </Select></Col>
                    </Row>
                    <Row id ="setSpaceTopComponent">
                        <Col>
                            <div id = "setTextTopic">Required Quantity : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> </Col>
                        <Col>
                            <InputNumber size="large" style={{ width: 180 }} min={1} max={1000} defaultValue={1} onChange={handleChangeQuantity} /></Col>
                        <Col><div id = "setTextTopic"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;File: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> </Col>
                        <Col>
                            <Upload {...img} maxCount={1}>
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                {/* {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton} */}
                            </Upload>

                        </Col>

                    </Row>
                    <Row id ="setSpaceTopComponent">
                        <Col>
                            <div id = "setTextTopic">Black or Colors : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>  </Col>
                        <Col>
                            <Radio.Group defaultValue="color" size="large" onChange={handleChangeColor}>
                                <Radio.Button value="black">Black</Radio.Button>
                                <Radio.Button value="color">Color</Radio.Button>
                            </Radio.Group>
                        </Col>
                        {/* <Col>
                            <Select size={'large'} style={{ width: 200 }} onChange={handleChangeColor} placeholder="Paper weight:">
                                <Option value="0">black</Option>
                                <Option value="1">color</Option>
                              
                            </Select></Col> */}

                    </Row>

                    <Row><Col><button onClick={handleSubmit} id = "setEffectButton"> CALCULATE </button></Col></Row>
                    
                </Col>
            </Row>

            <Footer style={{ backgroundColor: '#fcfcbc', bottom: 0, marginBottom: 0, position: 'fixed', width: '3000px' }}></Footer>
        </div>

    )
}
export default A4