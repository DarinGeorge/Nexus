import React from 'react'
import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ModalData from './ModalData';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export default function ChatStarter({ handleOpenChat, mutationData, beginChat }) {
    const classes = useStyles();
    const [userModal, setOpenUserModal] = React.useState(false);
    const [titleModal, setOpenTitleModal] = React.useState(false);

    const openUserModal = () => {
        setOpenUserModal(true);
    };

    const closeUserModal = () => {
        setOpenUserModal(false);
    };

    const openTitleModal = () => {
        setOpenTitleModal(true);
    };

    const closeTitleModal = () => {
        setOpenTitleModal(false);
    };

    return (
        <>
            <Button onClick={openUserModal}>+ New Chat</Button>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={userModal}
                onClose={closeUserModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={userModal}>
                    <div className={classes.paper}>
                        <h2 id="transition-modal-title">Select a User</h2>
                        <ModalData
                            id="transition-modal-description"
                            handleOpenChat={handleOpenChat}
                            closeUserModal={closeUserModal}
                            openTitleModal={openTitleModal}
                            closeTitleModal={closeTitleModal}
                            titleModal={titleModal}
                            mutationData={mutationData}
                            beginChat={beginChat}

                        />
                    </div>
                </Fade>
            </Modal>
        </>
    )
}