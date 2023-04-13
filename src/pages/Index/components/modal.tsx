import React, { ReactElement, ReactNode, useState, useEffect } from "react";
import { Modal } from 'antd'

// interface Props {
//     visible: boolean,
//     onClose: (val: boolean) => void,
//     type: number
// }

const OperModal = (): ReactElement<ReactNode> => {
    const [visible, setVisible] = useState<boolean>(true);
    // useEffect(() => {
    //     setVisible(props.visible)
    // }, [props.visible])
    return (
        <div className="oper-modal">
            <Modal visible={visible} confirmLoading={false} width={600} onCancel={() => {
                setVisible(false);
                // props.onClose(false)
            }} maskClosable title={null} closable={false} footer={null}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </div>
    )
};

export default OperModal;