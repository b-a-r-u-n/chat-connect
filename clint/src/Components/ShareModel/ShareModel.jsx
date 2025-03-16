import { Modal } from '@mantine/core';
import PostShare from '../PostShare/PostShare'

const ShareModel = ({modelOpened, setModelOpened}) => {

  return (
    <>
      <Modal
        opened={modelOpened}
        onClose={() => setModelOpened(false)}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        size="60%"
      >
        <PostShare />
      </Modal>
    </>
  );
}

export default ShareModel
