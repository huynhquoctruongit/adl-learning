import { Warning } from '@/components/common/modal';
import ModalView from '@/components/common/modal/template';
import { useModal } from '@/hooks/use-modal';
import useWarnIfUnsavedChanges from '@/hooks/use-warning';
import { useRef } from 'react';

// Ý tưởng: Mặc định sẽ sử dụng preventDefault,
// useWarnIfUnsavedChanges export ra 1 func để có thể thay đổi state giúp next step có thể tránh cái rule lúc đầu.

const WarningUnsave = ({ closeWarning, preventDefault, buttonConfirm, buttonCancel, ...rest }) => {
  const url = useRef();

  const [modal, toglleModal, setModal] = useModal();
  const callback = (payload) => {
    toglleModal();
    url.current = payload;
  };

  if (closeWarning)
    closeWarning.current = () => {
      setModal(false);
    };
  const { changePrevent } = useWarnIfUnsavedChanges(preventDefault, callback);
  const confirm = {
    ...buttonConfirm,
    action: () => {
      setModal(false);
      if (buttonConfirm.forceChange) changePrevent(false);
      if (buttonConfirm.action) buttonConfirm.action(url.current);
    }
  };

  const cancel = {
    ...buttonCancel,
    action: () => {
      setModal(false);
      if (buttonCancel.forceChange) changePrevent(false);
      if (buttonCancel.action) buttonCancel.action(url.current);
    }
  };
  return (
    <ModalView
      open={modal}
      toggle={() => {
        setModal(false);
      }}
    >
      <Warning {...rest} buttonConfirm={confirm} buttonCancel={cancel} />
    </ModalView>
  );
};

export default WarningUnsave;
