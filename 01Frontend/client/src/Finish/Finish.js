import React, { useState } from 'react'
import { Layout, Menu, Breadcrumb } from 'antd';
import 'antd/dist/antd.css';
import NavbarHead from '../page/NavbarHead'
const Finish = props => {
    const { Header, Content, Footer } = Layout;

    return (
        <div>
            <Layout >
              <NavbarHead/>
        </Layout></div>
    )
}
export default Finish