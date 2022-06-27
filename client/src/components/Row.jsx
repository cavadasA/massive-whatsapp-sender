import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FiSend } from 'react-icons/fi'


export default function Row(props) {

    const [checked, setChecked] = useState(false)

    function handleChecked(index) {  
        if (checked === false) {
            return setChecked(() => true);
        } else {
            return setChecked(() => false);
        }
    }    

    return (
        <tr className={checked ? "table-success" : ""}>
            <th scope="row">{props.index + 1}</th>
            <td>+{props.link.telefono}</td>
            <td><a href={props.link.enlace} target="_blank"><FiSend size={30} style={{ color: "pink" }} onClick={() => handleChecked(props.index)} /></a></td>
            <td className='text-center'>
                <div className="form-check d-flex justify-content-center align-items-center">
                    <input className="form-check-input text-end" type="checkbox" checked={checked} id={"prueba" + props.index} onChange={() => handleChecked(props.index)} />
                </div>
            </td>
        </tr>
    )
}

Row.propTypes = {
    index: PropTypes.number,
    link: PropTypes.object
}