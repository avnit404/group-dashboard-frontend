import React, { useEffect, useRef, useState } from 'react'
import './style.css'
import Dropdown from 'react-bootstrap/Dropdown';
import { Search, Trash2 } from 'react-feather'
import UpdateModal from '../component/UpdateModal';
import CreateGroupDetailForm from '../component/CreateGroupDetailForm';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { getGroup } from '../redux/group/groupType';
import { getTableAndColumn } from '../redux/tableColumn/tableColumnType';
import { updateGroupRequest } from '../redux/update-Group/updateGroupType';
import Spinner from 'react-bootstrap/Spinner';

const DashboardPage = () => {

    const [show, setShow] = useState(false)
    const [groupData, setGroupData] = useState()
    const [fetchTableData, setFetchTableData] = useState()
    const [openGroupDetailForm, setOpenGroupDetail] = useState(false)
    const [createGroupDetail, setCreateGroupDetail] = useState()
    const [selectedGroup, setSelectedGroup] = useState([])
    const [column, setColumn] = useState([])
    const [selectedTable, setSelectedTable] = useState([])
    const [latestTableName, setLatestTableName] = useState()
    const [columnData, setColumnData] = useState([])
    const [visibleColumns, setVisibleColumns] = useState();
    const [updateColumn, setUpdateColumn] = useState()
    const [oldColumnName, setoldColumnName] = useState()
    const [columnIndex, setColumnIndex] = useState()
    const [tableName, setTableName] = useState()
    const [tableIndex, setTableIndex] = useState()
    const dispatch = useDispatch();
    const data = useSelector(state => state.groups.groupData)
    const tableColumn = useSelector(state => state.tableColumn.tableColumn)
    const [selectedGroupData, setSelectedGroupData] = useState(data)
    const [visibleTable, setVisibleTable] = useState()
    const [tableBox, setTableBox] = useState(false)
    const [columnBox, setColumnBox] = useState(false)
    const [currentTable, setCurrentTable] = useState('')
    const [currentColumn, setCurrentColumn] = useState('')
    const [showLoader, setShowLoader] = useState(false);

    const dragItem = useRef();
    const dragOverItem = useRef();

    useEffect(() => {
        setGroupData(data)
    }, [data])

    useEffect(() => {
        setFetchTableData(tableColumn)
    }, [tableColumn])

    useEffect(() => {
        setVisibleColumns(columnData.slice(0, 5))
    }, [columnData])

    const handleSearchChange = (e) => {
        const filteredColumns = columnData.filter(item =>
            item.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setVisibleColumns(filteredColumns.slice(0, 5));
    };

    const handleClose = () => {
        setShow(false)
    }

    useEffect(() => {
        dispatch(getGroup())
        getGroupData()
        dispatch(getTableAndColumn())
        getTableData()
    }, [])

    const getGroupData = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/group/getGroup`)
            setGroupData((result.data.groups))
        } catch (error) {
            console.log(error)
        }
    }
    const getTableData = async () => {
        try {
            const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/group/getTableAndColumn`)
            setFetchTableData(result.data)
        } catch (error) {
            console.log(error)
        }
    }
    const handleChangeTable = (checked, labelName) => {

        const groupNames = selectedGroup.map(group => group.groupName);
        setSelectedTable([]);

        let updatedSelectedTables = [...selectedTable];

        if (!checked) {
            updatedSelectedTables = updatedSelectedTables.filter(table => !(table.tableName === labelName && table.groupName === groupNames[0]));
        } else {
            updatedSelectedTables.push({ checked: checked, tableName: labelName, groupName: groupNames[0] });
        }

        setSelectedTable(updatedSelectedTables);

        // Update selectedGroupData with the modified table data
        const updatedSelectedGroupData = selectedGroupData.map(item => {
            if (item.groupName === groupNames[0]) {
                let tables = updatedSelectedTables.filter(table => table.groupName === groupNames[0]).map(table => table.tableName);
                const existingTables = JSON.parse(item.table || "[]");
                if (!checked) {
                    tables = existingTables.filter(existingTable => existingTable !== labelName);
                } else {
                    tables = Array.from(new Set([...existingTables, ...tables]));
                }
                return { ...item, table: JSON.stringify(tables) };
            }
            return item;
        });

        setSelectedGroupData(updatedSelectedGroupData);
    };





    const hanleChangeGroup = (checked, groupName, item) => {
        setSelectedGroup([]);
        if (checked) {
            setSelectedGroup([{ checked: checked, groupName: groupName }]);
            setSelectedGroupData([item])
        } else {
            setSelectedGroupData([])
        }
        setVisibleTable(fetchTableData?.tables)
        setShowLoader(true)
        setTimeout(() => {
            setShowLoader(false);
        }, 1000);
    }

    const handleCloseGroupDetail = () => {
        setOpenGroupDetail(false)
    }

    const handleChangeColumn = (checked, column, tableName, columnIndex) => {
        const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
        const randomArray = new Uint32Array(1);
        crypto.getRandomValues(randomArray);
        const random = randomArray[0].toString();
        const random_number = timestamp + random;
        const findColumn = selectedGroupData.map((columnData) => JSON.parse(columnData.column))
        const existTable = findColumn[0].filter((item) => item.table === tableName)
        const existColumn = existTable?.map((item) => Object.keys(item)[0])
        const groupNames = selectedGroup.map(group => group.groupName);
        const isExistColumn = existColumn.some((item) => item === column)

        if (checked && !isExistColumn) {
            // Add the column to the state
            setColumn(prevTableColumns => ({
                ...prevTableColumns,
                [tableName]: [
                    ...(prevTableColumns[tableName] || []),
                    { [column]: column }
                ]
            }));

            const updatedSelectedGroupData = selectedGroupData.map(item => {
                if (item.groupName === groupNames[0]) {
                    const parsedColumn = JSON.parse(item.column);
                    const updatedColumns = [
                        ...(parsedColumn || []),
                        { [column]: column, table: tableName, index: (parsedColumn ? parsedColumn.length : 0) + 1, uniqueId: random_number }
                    ];
                    return { ...item, column: JSON.stringify(updatedColumns) };
                }
                return item;
            });
            setSelectedGroupData(updatedSelectedGroupData);
        } else if (!checked) {
            setColumn(prevTableColumns => ({
                ...prevTableColumns,
                [tableName]: (prevTableColumns[tableName] || []).filter(item => item[column] !== column)
            }));

            const updatedSelectedGroupData = selectedGroupData.map(item => {
                if (item.groupName === groupNames[0]) {
                    const parsedColumn = JSON.parse(item.column);
                    const updatedColumns = (parsedColumn || []).filter(entry => entry.uniqueId !== columnIndex);
                    return { ...item, column: JSON.stringify(updatedColumns) };
                }
                return item;
            });
          
            setTimeout(() => {
                setSelectedGroupData(updatedSelectedGroupData);
            }, 1000);
        }

    };





    const saveTableData = async () => {


        if (updateColumn) {
            let updatedGroupData = [...selectedGroupData];
            const group = updatedGroupData;
            updatedGroupData.forEach((group, groupIndex) => {
                if (group) {
                    let columnsObj = JSON.parse(group.column);
                    let columnsArray = columnsObj;

                    if (columnsArray && columnsArray.length > columnIndex) {
                        columnsObj = updateColumn; // Convert updateColumn to JSON string
                        group.column = JSON.stringify(columnsObj); // Convert columnsObj to JSON string
                        updatedGroupData = group;
                        // setGroupData(updatedGroupData);
                    } else {
                        console.error(`Invalid columnIndex ${columnIndex} or tableName ${tableName}`);
                    }
                } else {
                    console.error(`Invalid tableIndex ${tableIndex}`);
                }

            });
            const payload = {
                id: selectedGroupData[0].id,
                "groupName": selectedGroupData[0].groupName,
                "table": selectedGroupData[0].table,
                "column": JSON.stringify(updateColumn)
            };
            dispatch(updateGroupRequest(payload))
            setUpdateColumn()
            setTimeout(() => {
                getGroupData()
            }, 2000)
            setShowLoader(true);
            setTimeout(() => {
                setShowLoader(false);
            }, 1000);

        } else {
            const groupName = selectedGroupData.map((item) => item.groupName)[0]
            const table = selectedGroupData.map((item) => JSON.parse(item.table))
            const column = selectedGroupData.map((item) => JSON.parse(item.column))
            const id = selectedGroupData.map((item) => item.id)
            const payload = {
                "id": id[0],
                "groupName": groupName,
                "table": JSON.stringify(table[0]),
                "column": JSON.stringify(column[0])
            }
            // try {
            //     const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/group/updateGroup`, payload)
            //     // setFetchTableData(result.data)

            // } catch (error) {
            //     console.log(error)
            // }
            dispatch(updateGroupRequest(payload))
            setTimeout(() => {
                getGroupData()
            }, 2000)
            setShowLoader(true);
            setTimeout(() => {
                setShowLoader(false);
            }, 1000);
        }


    }
    useEffect(() => {
        const latestSelectedTableName = selectedTable[selectedTable.length - 1];
        const latestSelectedTableColumns = fetchTableData?.columns && fetchTableData?.columns[latestSelectedTableName?.tableName];
        const data = latestSelectedTableColumns ? [...latestSelectedTableColumns] : [];

        setLatestTableName(latestSelectedTableName?.tableName);
        setColumnData(data);

        if (selectedGroupData && selectedGroupData.column) {
            const parsedColumnData = JSON.parse(selectedGroupData.column);
            if (parsedColumnData[latestSelectedTableName?.tableName]) {
                setColumnData(parsedColumnData[latestSelectedTableName?.tableName]);
            }
        }
    }, [selectedTable, fetchTableData, selectedGroupData]);
    const handleUpdateColumn = async (newValue, oldColumnName, columnIndex, tableName, tableIndex, columns) => {
        const updatedColumns = [...columns];
        const columnObject = updatedColumns[columnIndex];
        
        if (columnObject && columnObject.hasOwnProperty(oldColumnName)) {
            columnObject[oldColumnName] = newValue;
            setSelectedGroupData(prevSelectedGroupData => {
                const updatedSelectedGroupData = [...prevSelectedGroupData];
                updatedSelectedGroupData[tableIndex].column = JSON.stringify(updatedColumns);
                return updatedSelectedGroupData;
            });
        }
        setUpdateColumn(updatedColumns);
        setoldColumnName(oldColumnName);
        setColumnIndex(columnIndex);
        setTableName(tableName);
        setTableIndex(tableIndex);
    };

    const handleSearchTable = (e) => {
        const filteredTables = fetchTableData.tables.filter(item =>
            item.toLowerCase().includes(e.target.value.toLowerCase()))
        setVisibleTable(filteredTables)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown-search')) {
                setTableBox(false);
                setColumnBox(false)
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);


    const handleDragStart = (e, position) => {
        dragItem.current = position;
    };

    const dragEnter = (e, position) => {
        e.preventDefault();
        dragOverItem.current = position;
    };

    const drop = (e) => {
        e.preventDefault();
        const updatedList = selectedGroupData.map(group => {
            const columns = JSON.parse(group.column);
            const draggedItemIndex = columns.findIndex(col => col.index === dragItem.current);
            const draggedOverItemIndex = columns.findIndex(col => col.index === dragOverItem.current);

            if (draggedItemIndex !== -1 && draggedOverItemIndex !== -1) {
                const updatedColumns = [...columns];
                const [removedItem] = updatedColumns.splice(draggedItemIndex, 1);
                updatedColumns.splice(draggedOverItemIndex, 0, removedItem);

                return {
                    ...group,
                    column: JSON.stringify(updatedColumns)
                };
            }
            return group;
        });

        setSelectedGroupData(updatedList);
        // setShowLoader(true);
        // setTimeout(() => {
        //     setShowLoader(false);
        // }, 1000);
    };

    return (
        <div className='datatable-hidden-fields'>
            <div className='row'>
                <div className='col-md-12'>
                    <div class="form-control">
                        <div class="d-flex">
                            <div >
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        {selectedGroup.length > 0 ? <b> Group {selectedGroup.length} Selected</b> : 'Please Select Group'}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <div class="dropdown-search">
                                            <input type="text" class="form-control" placeholder="Find a Field" />
                                        </div>

                                        <div class="form-cntl">
                                            {
                                                groupData && groupData.map((item) => {
                                                    return (
                                                        <div class="form-check form-switch">
                                                            <label class="form-check-label" for="tbl0" onClick={() => hanleChangeGroup(true, item.groupName, item)}>{item.groupName}</label>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div style={{ marginLeft: "10px" }}>
                                <Button className='add-button' onClick={() => setOpenGroupDetail(true)}>Add Group</Button>
                            </div>
                            {/* <div class="col col-xl-6">
                                <label class="form-label">Field(s) Selected</label>
                                <div id="tablesHelpBlock" class="form-text">
                                    <ul>
                                        {
                                            selectedGroup.map((item) => {
                                                return (
                                                    <li>{item.groupName}</li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            </div> */}
                        </div>

                    </div>
                    <div class="form-control">
                        <div class="row">
                            <div class="col col-xl-3">
                                {selectedGroupData && selectedGroupData[0]?.table && <div class="dropdown-search input-group">
                                    <div class="input-group-append">
                                        <label for="table-search" class="input-group-text"><Search height={18} width={18} /> </label>
                                    </div>
                                    <input type="text" id="table-search" class="form-control mb-0" value={currentTable} placeholder="Find a Table" onChange={(e) => {
                                        handleSearchTable(e)
                                        setCurrentTable(e.target.value)
                                        if (e.target.value === "") {
                                            setVisibleColumns([])
                                            setCurrentColumn('')
                                        }
                                    }} onFocus={() => setTableBox(true)} />
                                </div>}
                                {tableBox && <ul className="suggestions-list">
                                    {
                                        visibleTable?.map((item) => {
                                            return (
                                                <li onClick={() => {
                                                    if (selectedGroup && selectedGroup[0] && selectedGroup[0].groupName) {
                                                        handleChangeTable(true, item)
                                                        setTableBox(false)
                                                        setCurrentTable(item)
                                                        setCurrentColumn('')
                                                    }
                                                }}>
                                                    <div class="form-check form-switch">
                                                        <label class={`form-check-label`} for={`tbl-${item}`}>{item}</label>
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>}

                            </div>
                            {currentTable && <div class="col col-xl-3">
                                <div class="dropdown-search input-group" >
                                    <div class="input-group-append">
                                        <label for="table-search" class="input-group-text"><Search height={18} width={18} /> </label>
                                    </div>
                                    <input type="text" className="form-control mb-0" value={currentColumn} placeholder="Find a Column" onChange={(e) => {
                                        handleSearchChange(e)
                                        setCurrentColumn(e.target.value)
                                    }} onFocus={() => setColumnBox(true)} />
                                </div>
                                <div class="form-cntl">
                                    {columnBox && <ul className="suggestions-list">
                                        {visibleColumns && visibleColumns.map((item) => {
                                            const findColumn = selectedGroupData.map((columnData) => JSON.parse(columnData.column))
                                            const existTable = findColumn[0].filter((item) => item.table === latestTableName)
                                            const existColumn = existTable?.map((item) => Object.keys(item)[0])
                                            const groupNames = selectedGroup.map(group => group.groupName);
                                            const isExistColumn = existColumn.some((itemData) => itemData === item)
                                            return (
                                                <li onClick={(e) => {
                                                    handleChangeColumn(true, item, latestTableName)
                                                    setColumnBox(false)
                                                    setCurrentColumn(item)
                                                }}>
                                                    <div key={item} className="form-cntl">
                                                        <div className="form-check form-switch">
                                                            <label className={isExistColumn ? "disable" : "form-check-label"} htmlFor={`tbl-${item}`} onClick={() => handleChangeColumn(true, item, latestTableName)}>{item}</label>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>}
                                </div>
                            </div>}
                        </div>

                    </div>
                    {selectedGroup && selectedGroup[0] && <div className='ml'>{selectedGroup[0].groupName}</div>}
                    <div class="form-control">
                        <div class="row">

                        </div>

                    </div>
                    {selectedGroupData && selectedGroupData[0] && <Button onClick={() => saveTableData()}>Save</Button>}
                </div>
                <div className='col-md-12 custom-right'>
                    {showLoader ?
                        <Spinner />
                        :
                        <table className="table table-bordered">
                            <tbody className="tbl-info">
                                {selectedGroupData && selectedGroupData.length > 0 && selectedGroupData.map((group, groupIndex) => (
                                    <React.Fragment key={groupIndex}>
                                        <tr className="row-high">
                                            <th scope="row">{group.id}</th>
                                            <td>{group.groupName}</td>
                                        </tr>

                                        <tr key={`${groupIndex}-${tableIndex}`}>
                                            <td className="colspanclass" colSpan="4">
                                                <table className="table mb-0">
                                                    <thead className="innerth">
                                                        <tr>
                                                            <th scope="col">#</th>
                                                            <th scope="col">Table Name</th>
                                                            <th scope="col">Display Name</th>
                                                            <th scope="col">Internal Name</th>
                                                            <th scope="col">Delete</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody >
                                                        {
                                                            JSON.parse(group.column).map((column, columnIndex) => {
                                                                const columns = JSON.parse(group.column) || [];
                                                                return (<tr
                                                                    onDragStart={(e) => handleDragStart(e, column.index)}
                                                                    onDragEnter={(e) => dragEnter(e, column.index)}
                                                                    onDragEnd={(e) => drop(e)}
                                                                    draggable={true}
                                                                >
                                                                    <th scope="row">{columnIndex + 1}</th>
                                                                    <td>{column.table}</td>
                                                                    <td className="d-flex">
                                                                        <div className="edit-pencil">
                                                                            <input type='text' value={Object.values(column)[0]} onChange={(e) => handleUpdateColumn(e.target.value, Object.keys(column)[0], columnIndex, tableName, groupIndex, columns)} />
                                                                        </div>
                                                                    </td>
                                                                    <td>{Object.keys(column)[0]}</td>
                                                                    <td><div className="ms-3"><Trash2 onClick={() => handleChangeColumn(false, Object.keys(column)[0], tableName, column.uniqueId)} /></div></td>
                                                                </tr>)
                                                            })



                                                        }
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>}
                </div>
                <UpdateModal
                    show={show}
                    handleClose={handleClose}
                />
                <CreateGroupDetailForm
                    show={openGroupDetailForm}
                    handleClose={handleCloseGroupDetail}
                    setCreateGroupDetail={setCreateGroupDetail}
                    createGroupDetail={createGroupDetail}
                    getGroupData={getGroupData}
                />
            </div>
        </div >
    )
}

export default DashboardPage