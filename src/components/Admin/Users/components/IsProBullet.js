import React, { useContext, useState, useRef, useEffect } from 'react'
// import { MessageContext } from 'context/MessageContext'
import UsersService from '../../../../services/UsersService'
import NiceSelect, { components } from 'react-select'
import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import CloseIcon from '@material-ui/icons/Close'
import BulletPoint from '../../../BulletPoint'
import makeStyles from '@material-ui/core/styles/makeStyles'
import BooleanBullet from '../../BooleanBullet'
import { useMessage } from 'context/MessageContext'

const useStyles = makeStyles(() => ({
    editSelectPop: {
        position: 'absolute',
        width: '300px',
        padding: '1rem',
        border: '1px solid gainsboro',
        backgroundColor: 'antiquewhite'
    }
}))

const { Option } = components
const CustomSelectOption = (props) => {
    return (
        <Option {...props} className="d-flex align-items-center">
            {props.data.icon && props.data.icon}
            {props.data.label}
        </Option>
    )
}

const CustomSelectValue = (props) => (
    <div className="d-flex align-items-center">
        {props.data.icon && props.data.icon}
        {props.data.label}
    </div>
)

const ActivatedBullet = ({ username, value }) => {
    const classes = useStyles()
    const [activated, setActivated] = useState(value)
    const [clicked, setClicked] = useState(false)
    const { dispatchModal, dispatchModalError } = useMessage()
    const [selectedOption, setSelectedOption] = useState(null)
    const options = [
        {
            label: 'Yes',
            value: true,
            color: 'green'
        },
        {
            label: 'No',
            value: false,
            color: 'red'
        }
    ].map(option => ({
        ...option,
        icon: <BulletPoint color={option.color}/>
    }))

    const wrapperRef = useRef(null)
    useOutsideClicked(wrapperRef)

    function useOutsideClicked(ref) {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setSelectedOption(null)
                    setClicked(false)
                }
            }
            document.addEventListener("mousedown", handleClickOutside)
            return () => {
                document.removeEventListener("mousedown", handleClickOutside)
            }
        }, [ref])
    }

    const handleUpdate = async () => {
        try {
            const document = await UsersService.updateAdminUser(username, {
                pro: selectedOption
            })
            setActivated(activated => !activated)
            dispatchModal({ msg: `updated. Mail sent to ${document?.user?.email}` })
        } catch (err) {
            dispatchModalError({ err })
        }
    }

    return (
        <div className="edit" ref={wrapperRef}>
            {clicked ? (
                <div className={classes.editSelectPop}>
                    <NiceSelect
                        defaultValue={options.find(option => option.value === activated)}
                        onChange={(option) => setSelectedOption(option.value)}
                        options={options}
                        components={{
                            Option: CustomSelectOption,
                            SingleValue: CustomSelectValue
                        }}
                    />
                    <Button
                        startIcon={<CloseIcon/>}
                        onClick={() => {
                            setSelectedOption(null)
                            setClicked(false)
                        }}
                    />
                    <Button
                        startIcon={<SaveIcon/>}
                        onClick={async () => {
                            setClicked(false)
                            await handleUpdate()
                        }}
                    />
                </div>
            ) : (
                <BooleanBullet
                    bool={activated}
                    onClick={() => {
                        setClicked(true)
                    }}/>
            )}
        </div>
    )
}

export default ActivatedBullet
