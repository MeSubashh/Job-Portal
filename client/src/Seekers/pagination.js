import React from "react";

function Pagination({totalPosts,postsPerPage,setCurrentPage}){
    let pages = [];
    for(let i = 1;i<= Math.ceil(totalPosts/postsPerPage);i++){
        pages.push(i);
    }
    return(
        <div className="pagination">
            {pages.map((page,index)=>{
                return <button key = {index} onClick={()=>setCurrentPage(page)}>{page}</button>
            })}
        </div>
    )
}

export default Pagination;