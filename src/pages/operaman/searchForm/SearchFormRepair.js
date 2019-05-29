import { Row, Col, Form, Input, Select, Button } from 'antd'
import styles from '../operaman.less'
const states = ['未接收','处理中','其他','挂起','已关闭']
const FormItem = Form.Item
const { Option } = Select

const SearchFormRepair = Form.create()(props => {
    const { form, onSubmit, handleSearch } = props;
    const { getFieldDecorator } = form;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return
        if (!err) {
            handleSearch(fieldsValue)
            return
        }
      });
    };

   const resetField = () => {
        form.resetFields();
        okHandle();
   }

    const layoutCol = {
        xl: 4,
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
        <Form className={styles.searchForm} onSubmit={okHandle} layout="inline">
            <Row>
                <Col {...layoutCol}>
                    <FormItem label="设备编号" >
                        {getFieldDecorator('mn')( <Input size="small" /> )}
                    </FormItem>
                </Col>
                <Col {...layoutCol}>
                    <FormItem label="归属单位" >
                        {getFieldDecorator('uname')( <Input size="small" /> )}
                    </FormItem>
                </Col>
                <Col {...layoutCol}>
                    <FormItem label="上报人" >
                        {getFieldDecorator('rpName')( <Input size="small" /> )}
                    </FormItem>
                </Col>
                <Col {...layoutCol}>
                    <FormItem label="处理状态" >
                        {getFieldDecorator('rpStatus')(
                            <Select style={{ width: '100%' }} allowClear size="small">
                            {
                                states.map(item => (
                                    <Option value={item} key={item}>{item}</Option>
                                ))
                            }
                            </Select>
                        )}
                    </FormItem>
                </Col>               
                <div style={{ margin: '16px 0 24px' }}>
                    <Button className={styles.successfulBtn} htmlType="submit" size="small" type="primary" style={{ ...boxStyle }}> 查询 </Button>
                    <Button className={styles.primaryBtn} size="small" onClick={() => resetField()} size="small"> 重置 </Button>
                </div>
            </Row>                
        </Form>
    );
});

export default SearchFormRepair;