import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import { faFilter } from '@fortawesome/free-solid-svg-icons';

const Table = (props) => {
    let { data, headers } = props;
    let [showDiv, setShowDiv] = useState(false);
    let [showData, setShowData] = useState(data);
    let [filterConfig, setFilterConfig] = useState({});
    let [pageSize, setPageSize] = useState(5);
    let [currentPage, setCurrentPage] = useState(0);
    let [currentData, setCurrentData] = useState(data.slice(0, pageSize));
    let [pageCount, setPageCount] = useState(Math.ceil(showData.length / pageSize));


    useEffect(() => {
        if (Object.keys(filterConfig).length == 0) {
            setCurrentData(data.slice(0, pageSize));
        }
    }, [filterConfig])

    const handleShowFilterDiv = () => {
        setShowDiv(!showDiv)
    }
    const handleInputData = (e) => {
        e.preventDefault();
        if (e.target.value === "") {
            setFilterConfig((prevState) => {
                let { [e.target.name]: _, ...newObject } = prevState;
                return newObject
            })
        } else {
            setFilterConfig(prveState => ({ ...prveState, [e.target.name]: e.target.value }))
        }

    }
    const handleSort = (e) => {

        let data2 = [...showData];


        data2.sort((a, b) => {
            let { key, dataType } = JSON.parse(e.target.dataset.src);

            switch (dataType) {
                case "string":
                    return a[key].localeCompare(b[key]);
                case "number":
                    return a[key] < b[key];

            }
        })


        setCurrentData(data2);

    }
    const handleSubmit = () => {

        let filterdata = data.filter((data) => {

            let newFilterConfig = Object.entries(filterConfig);
            return newFilterConfig.every(([key, value]) => {
                let { dataType } = headers.find((header) => {
                    if (header.key === key) {
                        return true
                    } else return false;
                });

                switch (dataType) {
                    case "number":
                        return parseInt(value) === data[key];
                    case "string":
                        return value === data[key]
                }

            });
        });


        setCurrentData(filterdata);

    }


    const RemoveFilterConfig = () => {
        setFilterConfig({});
    }

    const onPageChange = (index) => {
        setCurrentPage(index);
        let currentData = showData.slice(index * pageSize, pageSize * (index + 1));
        setCurrentData(currentData)

    }

    return (
        <div className=' w-full overflow-x-scroll'>

            <div className="flex justify-start items-center border-b-2 border-slate-400 p-3 w-full fixed bg-slate-300 z-50 ">
                <div><FontAwesomeIcon icon={faFilter} onClick={handleShowFilterDiv} />Filter</div>

            </div>
            <div className='flex w-full '>

                {showDiv ? <>  <div className=' w-1/4 h-40 border-r-2 border-l-slate-500 mt-20 md:w-1/2 sm:w-3/4'>
                    {headers.map((headerConfig) => {
                        return <div className='flex justify-between p-2 items-center' key={headerConfig.id}>
                            <div className='px-2'><lable htmlFor={headerConfig.key} >{headerConfig.label}</lable></div>
                            <div><input type="text" className='border-2 border-slate-300 rounded-lg p-1 ' name={headerConfig.key}
                                onChange={handleInputData} value={filterConfig[headerConfig.key] || ""} /></div>
                        </div>
                    })}
                    <div className='flex justify-between '>
                        <div> <button onClick={RemoveFilterConfig} className='bg-black text-white mx-5 px-4 py-2 rounded-lg active:bg-blue-500'>Reset</button></div>
                        <div className='flex justify-center'> <button className='bg-black text-white rounded-lg px-4 py-2 font-bold' onClick={handleSubmit}>Search</button></div>

                    </div>

                </div></> : null}


                <div className='w-full '>
                    <table className='w-full mt-10 ' >
                        <thead className=''>

                            <tr className='border-b-2  bg-black text-white'>
                                {headers.map((header) => {
                                    return <td className="p-4 text-start
                                     font-normal font-serif" key={header.key} data-src={JSON.stringify(header)} onClick={handleSort}>{header.label}</td>
                                })}
                            </tr>

                        </thead>

                        <tbody>

                            {
                                currentData.map((person) => {
                                    return <tr className='border-b-2 border-slate-300  hover:bg-slate-300 ' key={person.id}>
                                        {headers.map((headerConfig) => {
                                            return <td className="border border-slate-300 p-4">{person[headerConfig.key]}</td>
                                        })}
                                    </tr>
                                }

                                )}

                        </tbody>
                    </table>
                    <div className='flex justify-center items-center my-5 fixed bottom-0 inset-x-0 '>
                        <button className='p-4 bg-black text-white rounded-l-lg' onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0}>
                            prev
                        </button>
                        <div className='flex '>
                            {
                                Array(pageCount).fill(null).map((page, index) => {
                                    return <div key={index} className='px-6 py-4 bg-white border-2 ' id={`${currentPage === index ? 'active-btn' : ""}`} onClick={() => { onPageChange(index) }}>{index + 1}</div>
                                })
                            }
                        </div>
                        <button className='p-4 bg-black text-white  rounded-r-lg' onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === pageCount - 1}>Next</button>
                    </div>
                </div>
            </div >

        </div >
    )
}

export default Table