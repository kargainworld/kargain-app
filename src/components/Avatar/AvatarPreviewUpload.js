import React, { useContext, useEffect, useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { MessageContext } from '../../context/MessageContext';
import { useAuth } from '../../context/AuthProvider';
import UsersService from '../../services/UsersService';

const FileInput = ({ value, onChange = noop, ...rest }) => (
  <input
    {...rest}
    // style={{ display: "none" }}
    type="file"
    id="imageUpload"
    accept=".png, .jpg, .jpeg"
    onChange={(e) => {
      onChange([...e.target.files]);
    }}
  />
);

const AvatarPreviewUpload = () => {
  const { authenticatedUser, updateAuthenticatedRawUser, isAuthenticated } = useAuth();
  const { dispatchModal, dispatchModalError } = useContext(MessageContext);
  const [avatarLocation, setAvatarLocation] = useState(authenticatedUser.getAvatar);
  const [avatarUrl, setAvatarUrl] = useState(authenticatedUser.getAvatarUrl);

  const onChangeFile = (files) => {
    dispatchModal({ msg: 'Uploading...', persist: true });
    let data = new FormData();
    data.append('avatar', files[0]);

    UsersService.uploadAvatar(data)
      .then((doc) => {
        updateAuthenticatedRawUser(doc);
        dispatchModal({ msg: 'Upload Successfully' });
      })
      .catch((err) => {
        dispatchModalError({ err, persist: true });
      });
  };

  const handleRemoveAvatar = () => {
    const userId = authenticatedUser.getID;
    UsersService.removeAvatar(userId)
      .then((doc) => {
        updateAuthenticatedRawUser(doc);
        dispatchModal({ msg: 'Remove Successfully' });
      })
      .catch((err) => {
        dispatchModalError({ err, persist: true });
      });
  };

  useEffect(() => {
    setAvatarLocation(authenticatedUser.getAvatar);
    setAvatarUrl(authenticatedUser.getAvatarUrl);
  }, [authenticatedUser]);
  
  return (
    <div className="avatar-upload">
      {isAuthenticated && (
        <div className="avatar-edit">
          <FileInput onChange={onChangeFile} />
          {avatarLocation ? (
            <label onClick={handleRemoveAvatar}>
              <CloseOutlinedIcon />
            </label>
          ) : (
            <label htmlFor="imageUpload">
              <EditIcon />
            </label>
          )}
        </div>
      )}
      <div className="avatar-preview" style={{ height: 160, width: 160 }}>
        <div id="imagePreview" style={{ backgroundImage: `url(${avatarLocation ? avatarLocation : avatarUrl})` }} />
      </div>
    </div>
  );
};

export default AvatarPreviewUpload;
