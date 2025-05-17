const modalStyle={
    position:'fixed',
    top:'30%',
    left:'50%',
    tranform:'translate(-50%,-30%)',
    backgroundColor:'white',
    padding:'20px',
    border:'2px solid #ccc',
    borderRadius:'12px',
    zIndex:1000,
    boxShadow:'0px 0px 20px rgba(0,0,0,0.3)',
    textAlign:'center'
}

const buttonStyle={
    margin:'10px',
    padding:'10px 20px',
    fontSize:'16px',
    cursor:'pointer'
}

function SessionPopup({onEnd,onExtend}){
    return(
        <div style={modalStyle}>
            <h3>Your parking session has expired.</h3>
            <p>Do you like to end it or the extend it?</p>
            <button style={buttonStyle} onClick={onEnd}>End</button>
            <button style={buttonStyle} onClick={onExtend}>Extend</button>
        </div>
    )
}

export default SessionPopup