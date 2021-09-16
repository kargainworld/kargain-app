import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import ImageGallery from 'react-image-gallery'

const GalleryViewer = forwardRef(({ images, handleClick, isAnnounceCard }, ref) => {

    if (!images || images.length === 0) return null

    const items = images.map(image => ({
        original: image.getLocation,
        thumbnail: image.getLocation
    }))
    const handleSelfClick = () => {
        if(ref.current) ref.current.toggleFullScreen()
    }

    return <ImageGallery
        ref={ref}
        lazyLoad
        showThumbnails={!isAnnounceCard}
        showPlayButton={false}
        showFullscreenButton={false}
        items={items}
        onClick={isAnnounceCard ? handleClick : handleSelfClick}
    />
})

GalleryViewer.propTypes = {
    images: PropTypes.arrayOf(
        PropTypes.shape({
	    original: PropTypes.string,
	    thumbnail: PropTypes.string
        })),
    handleClick: PropTypes.func,
    isAnnounceCard: PropTypes.bool
}

GalleryViewer.defaultProps = {
    images: []
}

export default GalleryViewer
