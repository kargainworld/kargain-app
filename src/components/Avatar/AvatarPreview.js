import React from 'react'

const AvatarPreview = ({ src }) => {
    return(
        <div className="avatar-upload" style={{ marginTop: '15px' }}>
            <div className="avatar-preview" style={{ width: '164px', height: '164px' }}>
                <div id="imagePreview" style={{ backgroundImage: `url(${src})` }} />
            </div>
        </div>
    )
}

export default AvatarPreview
