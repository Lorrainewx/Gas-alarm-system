import React, {PureComponent} from 'react'
import {
    Row,
    Col,
    Form,
    Input,
    Select,
    Button,
    DatePicker
} from 'antd'
import moment from 'moment'
import { omit } from 'lodash'
import styles from '../operaman.less'
const states = ['未接收', '处理中', '其他', '挂起', '已关闭']
const {RangePicker} = DatePicker
const FormItem = Form.Item
const {Option} = Select

@Form.create()
class SearchFormAlarm extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            startTime: '',
            endTime: ''
        }
    }
    okHandle = () => {
        const {form, handleSearch} = this.props
        const {getFieldDecorator} = form

        const { endTime, startTime } = this.state
        form.setFieldsValue({
            endTime,
            startTime
        });

        form.validateFields((err, fieldsValue) => {
            if (err) 
                return
            if (!err) {                
                handleSearch(omit(fieldsValue, ['date']))
                return
            }
        })
    }

    handleDateOnChange = (dates, dateStrings) => {
        this.setState({
            startTime: dateStrings[0],
            endTime: dateStrings[1],
        })
    }

    resetField = () => {
        const {form, handleSearch} = this.props
        form.resetFields();
       this.okHandle();
    }

    render () {
        const { form } = this.props
        const { getFieldDecorator } = form

        const layoutCol = {
            xl: 4,
            lg: 6,
            md: 12,
            sm: 24
        }    
        const layoutCol2 = {
            xl: 6,
            lg: 6,
            md: 12,
            sm: 24
        }

        const boxStyle = {
            borderRadius: '4px',
            marginLeft: '12px',
            marginRight: '10px'
        }

        return (
            <Form className={styles.searchForm} onSubmit={this.okHandle} layout="inline">
                <Row>
                    <Col {...layoutCol}>
                        <FormItem label="设备编号">
                            {getFieldDecorator('deviceid')(<Input size="small"/>)}
                        </FormItem>
                    </Col>
                    <Col {...layoutCol2}>
                        <FormItem label="选择时间">
                            {getFieldDecorator('date')
                                (<RangePicker
                                    size="small"
                                    style={{ width: '100%' }}
                                    ranges={{
                                        Today: [
                                            moment(), moment()
                                        ],
                                        'this month': [
                                            moment().startOf('month'),
                                            moment().endOf('month')
                                        ]
                                    }}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    onChange={this.handleDateOnChange}/>
                                )
                            }
                        </FormItem>
                        <FormItem label="开始时间" style={{display: 'none'}}> {getFieldDecorator('startTime')(<Input />)}</FormItem>
                        <FormItem label="结束时间"  style={{display: 'none'}}> {getFieldDecorator('endTime')(<Input />)}</FormItem>
                    </Col>
                    <Col {...layoutCol}>
                        <FormItem label="单位名称">
                            {getFieldDecorator('unitname')(<Input size="small"/>)}
                        </FormItem>
                    </Col>
                    <Col {...layoutCol}>
                        <FormItem label="工单状态">
                            {getFieldDecorator('status')(
                                <Select 
                                    style={{ width: '100%' }}
                                    allowClear
                                    size="small">
                                    {
                                        states.map(item => (
                                            <Option value={item} key={item}>{item}</Option>
                                        ))
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...layoutCol}>
                        <FormItem label="创建人">
                            {getFieldDecorator('creatername')(<Input size="small"/>)}
                        </FormItem>
                    </Col>
                    <div style={{
                        margin: '16px 0 24px'
                    }}>
                        <Button  className={styles.successfulBtn} htmlType="submit" size="small" type="primary"  style={{ ...boxStyle }}> 查询 </Button>                        
                        <Button className={styles.primaryBtn} size="small" onClick={() => this.resetField()} size="small" > 重置 </Button>
                    </div>
                </Row>
            </Form>
        );
        
    }
}
export default SearchFormAlarm;