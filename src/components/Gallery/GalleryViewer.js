import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import ImageGallery from 'react-image-gallery'

const GalleryViewer = forwardRef(({ images, handleClick }, ref) => {
    if (!images || images.length === 0) return null

    const items = images.map(image => ({
        original: image.getLocation,
        thumbnail: image.getLocation
    }))

    return <ImageGallery
        ref={ref}
        lazyLoad
        autoPlay
        showIndex
        showBullets
        showThumbnails={false}
        showPlayButton={false}
        showIndex={false}
        items={items}
        onClick={handleClick}
    />
})

GalleryViewer.propTypes = {
    images: PropTypes.arrayOf(
        PropTypes.shape({
            original: PropTypes.string,
            thumbnail: PropTypes.string
        }))
}

GalleryViewer.defaultProps = {
    images: []
}

export default GalleryViewer
