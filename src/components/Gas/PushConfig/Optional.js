import React, { PureComponent } from 'react';
import { Icon }  from 'antd';

import styles from './index.less';

const Optional = class extends PureComponent{
    static defaultProps = {
        checked: false,
        disabled: false,
        type: 'check',
        onChange: ()=>{}
    }
    constructor(props){
        super(props)
        this.type = {
            append: 'plus-square',
            remove: props.type === 'check' ? 'check-square' : 'minus-square'
        }
    }
    render(){
        const { children, onChange, checked } = this.props;

        return (
            <div className={ styles.optionalButton } data-state={ this.type[checked ? 'remove' : 'append'] } onClick={()=>onChange(checked)}>
                <Icon className={ styles.optionalIcon } type={ this.type[checked ? 'remove' : 'append'] } />
                { children }
            </div>
        )
    }
};

export default Optional;