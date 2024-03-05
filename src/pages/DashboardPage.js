import React, { useEffect, useState } from 'react'
import './style.css'
import Dropdown from 'react-bootstrap/Dropdown';
import { Edit2, Plus } from 'react-feather'
import UpdateModal from '../component/UpdateModal';
import CreateGroupDetailForm from '../component/CreateGroupDetailForm';
import Button from 'react-bootstrap/esm/Button';
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { getGroup } from '../redux/group/groupType';
import { getTableAndColumn } from '../redux/tableColumn/tableColumnType';
import { updateGroupRequest } from '../redux/update-Group/updateGroupType';

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
        // getGroupData()
        dispatch(getTableAndColumn())
        // getTableData()
    }, [])

    // const getGroupData = async () => {
    //     try {
    //         const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/group/getGroup`)
    //         setGroupData((result.data.groups))
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
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
    
        // If the table is unchecked, remove it from updatedSelectedTables
        if (!checked) {
            updatedSelectedTables = updatedSelectedTables.filter(table => !(table.tableName === labelName && table.groupName === groupNames[0]));
        } else {
            // If the table is checked, add it to updatedSelectedTables
            updatedSelectedTables.push({ checked: checked, tableName: labelName, groupName: groupNames[0] });
        }
    
        setSelectedTable(updatedSelectedTables);
    
        // Update selectedGroupData with the modified table data
        const updatedSelectedGroupData = selectedGroupData.map(item => {
            if (item.groupName === groupNames[0]) {
                let tables = updatedSelectedTables.filter(table => table.groupName === groupNames[0]).map(table => table.tableName);
                const existingTables = JSON.parse(item.table || "[]");
                if (!checked) {
                    // If the table is unchecked, remove it from the existingTables
                    tables = existingTables.filter(existingTable => existingTable !== labelName);
                } else {
                    // If the table is checked, add it to the existingTables
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
    }

    const handleCloseGroupDetail = () => {
        setOpenGroupDetail(false)
    }

    const handleChangeColumn = (checked, column, tableName) => {
        const groupNames = selectedGroup.map(group => group.groupName);
    
        if (checked) {
            setColumn(prevTableColumns => ({
                ...prevTableColumns,
                [tableName]: [
                    ...(prevTableColumns[tableName] || []),
                    { [column]: column }
                ]
            }));
    
            const updatedSelectedGroupData = selectedGroupData.map(item => {
                if (item.groupName === groupNames[0]) {
                    const updatedColumns = {
                        ...JSON.parse(item.column),
                        [tableName]: [
                            ...(JSON.parse(item.column)[tableName] || []),
                            { [column]: column }
                        ]
                    };
                    return { ...item, column: JSON.stringify(updatedColumns) };
                }
                return item;
            });
    
            setSelectedGroupData(updatedSelectedGroupData);
        } else {
            setColumn(prevTableColumns => ({
                ...prevTableColumns,
                [tableName]: (prevTableColumns[tableName] || []).filter(item => item[column] !== column)
            }));
    
            const updatedSelectedGroupData = selectedGroupData.map(item => {
                if (item.groupName === groupNames[0]) {
                    const updatedColumns = {
                        ...JSON.parse(item.column),
                        [tableName]: (JSON.parse(item.column)[tableName] || []).filter(entry => Object.keys(entry)[0] !== column)
                    };
                    return { ...item, column: JSON.stringify(updatedColumns) };
                }
                return item;
            });
    
            setSelectedGroupData(updatedSelectedGroupData);
        }
    };
    


    const saveTableData = async () => {



        if (updateColumn) {
            const updatedGroupData = [...selectedGroupData];
            const group = updatedGroupData[tableIndex];

            updatedGroupData.forEach((group, groupIndex) => {
                if (group) {
                    const columnsObj = JSON.parse(group.column);
                    const columnsArray = columnsObj[tableName];

                    if (columnsArray && columnsArray.length > columnIndex) {
                        columnsObj[tableName] = updateColumn; // Convert updateColumn to JSON string
                        group.column = JSON.stringify(columnsObj); // Convert columnsObj to JSON string
                        updatedGroupData[tableIndex] = group;
                        // setGroupData(updatedGroupData);
                    } else {
                        console.error(`Invalid columnIndex ${columnIndex} or tableName ${tableName}`);
                    }
                } else {
                    console.error(`Invalid tableIndex ${tableIndex}`);
                }

            });
            const payload = {
                id: group.id,
                "groupName": group.groupName,
                "table": group.table,
                "column": group.column
            };
            dispatch(updateGroupRequest(payload))
            // try {
            //     const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/group/updateGroup`, payload)
            //     // setFetchTableData(result.data)

            // } catch (error) {
            //     console.log(error)
            // }
            dispatch(getGroup())
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
            dispatch(getGroup())
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
        }
        setUpdateColumn(updatedColumns);
        setoldColumnName(oldColumnName);
        setColumnIndex(columnIndex);
        setTableName(tableName);
        setTableIndex(tableIndex);
    };

    return (
        <div className='datatable-hidden-fields'>
            <div className='row'>
                <div className='col-md-4 custom-left'>
                    <div className='d-flex justify-content-end'><Plus style={{ cursor: 'pointer' }} onClick={() => setOpenGroupDetail(true)} /></div>
                    <div class="form-control">
                        <div class="row">
                            <div class="col col-xl-6">
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
                                                            <input class="form-check-input" type="checkbox" checked={selectedGroup.some(table => table.groupName === item.groupName) ? selectedGroup.find(table => table.groupName === item.groupName).checked : false} id="tbl0" onChange={(e) => hanleChangeGroup(e.target.checked, item.groupName, item)} />
                                                            <label class="form-check-label" for="tbl0">{item.groupName}</label>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div class="col col-xl-6">
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
                            </div>
                        </div>

                    </div>
                    <div class="form-control">
                        <div class="row">
                            <div class="col col-xl-6">
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        <b>{selectedTable.length > 0 ? selectedTable.length : ''}</b>  Tables Selected
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <div class="dropdown-search">
                                            <input type="text" class="form-control" placeholder="Find a Field" />
                                        </div>
                                        <div class="form-cntl">
                                            {
                                                fetchTableData && fetchTableData.tables?.map((item) => {
                                                    const isTableExists = selectedGroupData && selectedGroupData[0]?.table && JSON.parse(selectedGroupData[0]?.table)?.includes(item);

                                                    return (
                                                        <div class="form-check form-switch">
                                                            <input class="form-check-input" type="checkbox" id="tbl0" checked={selectedTable.some(table => table.tableName === item) ? selectedTable.find(table => table.tableName === item).checked : false} onChange={(e) => handleChangeTable(e.target.checked, item)} />
                                                            <label class={`form-check-label ${isTableExists ? 'fw-bold' : ''}`} for={`tbl-${item}`}>{item}</label>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div class="col col-xl-6">
                                <label class="form-label">Tables(s) Selected</label>
                                <div id="tablesHelpBlock" class="form-text">
                                    <ul>
                                        {selectedGroupData && selectedGroupData[0]?.table && JSON.parse(selectedGroupData[0]?.table).map((item) => {
                                            return (
                                                <li>
                                                    {item}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="form-control">
                        <div class="row">
                            <div class="col col-xl-6">
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        {column.length > 0 ? `Column ${column.length} Selected` : 'Please Select Fields(s)'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <div class="dropdown-search">
                                            <input type="text" class="form-control" placeholder="Find a Field" onChange={handleSearchChange} />
                                        </div>
                                        {visibleColumns && visibleColumns.map((item) => {
                                            const columnsData = selectedGroupData && selectedGroupData[0]?.column && JSON.parse(selectedGroupData[0].column);
                                            const isSelected = columnsData && columnsData[latestTableName]?.some(column => column.hasOwnProperty(item)); return (
                                                <div key={item} className="form-cntl">
                                                    <div className="form-check form-switch">
                                                        <input className="form-check-input" type="checkbox" value="" id={`tbl-${item}`} onChange={(e) => handleChangeColumn(e.target.checked, item, latestTableName)} checked={isSelected} />
                                                        <label className="form-check-label" htmlFor={`tbl-${item}`}>{item}</label>
                                                    </div>
                                                </div>
                                            );

                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div class="col col-xl-6">
                                <label class="form-label">Column(s) Selected</label>
                                <div id="tablesHelpBlock" class="form-text">
                                    <ul>
                                        {column[latestTableName]?.map((item) => {
                                            return (
                                                <li>
                                                    {Object.keys(item)}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                    <Button onClick={() => saveTableData()}>Save</Button>
                </div>
                <div className='col-md-8 custom-right'>
                    <table className="table table-bordered">
                        <tbody className="tbl-info">
                            {selectedGroupData && selectedGroupData.map((group, groupIndex) => (
                                <React.Fragment key={groupIndex}>
                                    <tr className="row-high">
                                        <th scope="row">{group.id}</th>
                                        <td>{group.groupName}</td>
                                    </tr>
                                    {JSON.parse(group.table).map((tableName, tableIndex) => {
                                        const columns = JSON.parse(group.column)[tableName] || [];
                                        return (
                                            <tr key={`${groupIndex}-${tableIndex}`}>
                                                <td className="colspanclass" colSpan="4">
                                                    <table className="table mb-0">
                                                        <thead className="innerth">
                                                            <tr>
                                                                <th scope="col">#</th>
                                                                <th scope="col">Table Name</th>
                                                                <th scope="col">Display Name</th>
                                                                <th scope="col">Internal Name</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {columns.map((column, columnIndex) => (
                                                                <tr key={`${groupIndex}-${tableIndex}-${columnIndex}`}>
                                                                    <th scope="row">{columnIndex + 1}</th>
                                                                    <td>{tableName}</td>
                                                                    <td className="d-flex">
                                                                        {Object.keys(column)[0]}{' '} :  {Object.values(column)[0]}{' '}
                                                                        <div className="edit-pencil">
                                                                            <input type='text'  style={{ width: "50px", height: "18px", marginLeft: '10px' }} onChange={(e) => handleUpdateColumn(e.target.value, Object.keys(column)[0], columnIndex, tableName, groupIndex, columns)} />
                                                                        </div>
                                                                    </td>
                                                                    <td>{Object.values(column)[0]}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
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
                />
            </div>
        </div>
    )
}

export default DashboardPage