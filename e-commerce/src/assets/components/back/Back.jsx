import React from 'react'

export default function Back() {
  return (
    <>
    <div style={{margin:"10px 0px 10px 0px " , padding:"0px"}}>
        <div className="d-grid gap-2">
            <button className="btn btn-primary" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Back to top</button>
        </div>
    </div>
    <hr />
    </>
  )
}
