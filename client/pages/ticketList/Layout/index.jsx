import React, { PureComponent } from 'react';
import errorBoundary from 'ErrorBoundary';
import wxSDK from '@/wxUtils/wxSDK';
import styles from './index.css';

/**
 * Layout
 */
class Layout extends PureComponent {
    async componentDidMount() {
        this.wxUtils = new wxSDK();
        await this.wxUtils.isLogin();
    }

    render() {
        return (
            <div>
                <p className={styles.font}>1123</p>
            </div>
        );
    }
}

export default errorBoundary(Layout);
