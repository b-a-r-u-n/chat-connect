import { Button, Group, Modal } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { getUserDetails } from '../../Features/homeSlice';
import { useState } from 'react';

const DeleteModel = ({deleteModel, setDeleteModel, id, setIsMenuOpen}) => {

    const dispatch = useDispatch();

    const [isDelete, setIsDelete] = useState(false);

    const handaleCancel = () => {
        setDeleteModel(false);
        setIsMenuOpen(false);
    }

    const handaleDelete = async () => {
        setIsDelete(true);        
        const responce = await fetch(`${import.meta.env.VITE_BASE_URL}/post/${id}`, {
              method: 'DELETE',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              }
            })
            const data = await responce.json();
        
            // console.log(data);
            if(data.success === false || data.success === 'false')
              alert(data.message);
              
            setIsDelete(false);
            setIsMenuOpen(prev => !prev);
            dispatch(getUserDetails(sessionStorage.getItem('id')));
    }

  return (
    <>
        <Modal opened={deleteModel} onClose={handaleCancel}>
            Are you sure you want to delete this post? This action cannot be undone.
            <Group mt="lg" justify="flex-end">
                <Button 
                    onClick={handaleCancel} 
                >
                    Cancel
                </Button>
                <Button onClick={handaleDelete} color="red">
                    {
                        isDelete ? 'Deleting...' : 'Delete'
                    }
                </Button>
            </Group>
        </Modal>
    </>
  );
}

export default DeleteModel
