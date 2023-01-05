import { Grid, IconButton,Stack, FormControl, InputLabel, Select, Pagination, MenuItem } from "@mui/material"
import { Delete, Edit } from "@mui/icons-material";
import React, { useState, useEffect } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { Lista }  from "../components"
import useSWR from 'swr'
import { getId, userIsLoggedIn } from "../services/auth";
import axios from "axios";

const deleteDocument = async (id) => {
    const conf = window.confirm("Tem certeza que deseja deletar este arquivo?")
    if(conf) {
        try {
            await axios ({
                method: 'delete',
                url: `http://localhost:3002/document/${id}`,
                headers: { 'Content-Type': 'application/json'}
            })
            alert('Arquivo deletado')
        }
        catch(err) {
            alert('Erro ao deletar')
        }
    }
}

const fetcher = (...args)  => fetch(...args).then(res => res.json())

const Documents = ({ setCurrentRoute }) => {
    const location = useLocation()
    setCurrentRoute(location.pathname)
    const navigate = useNavigate()

    useEffect(() => {
        userIsLoggedIn(navigate, location.pathname)
      }, [])

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(8)
    const user = getId()

    const handleChange = (event, value) => {
        setPage(value)
    }

    const { data, error, isLoading } = useSWR(`http://localhost:3002/document?id=${user.id}&page=${page}&limit=${limit}`, fetcher, {refreshInterval: 5000})

    const columns = [
        { headerName: 'Id', key: '_id', id: true },
        { headerName: 'Título', key: 'title', id: true },
        { headerName: 'Conteúdo', key: 'content', id: false },
        { headerName: 'Criado em', key: 'createdAt', id: false  },
        { headerName: 'Última alteração', key: 'updatedAt', id: false  },
        { headerName: 'Ações', key: 'null', id: false, action: (params) => {
            return <>
                <IconButton onClick={() =>  navigate(`/document/${params._id}`)} >
                    <Edit></Edit>
                </IconButton>
                <IconButton onClick={() => deleteDocument(params._id)} >
                    <Delete></Delete>
                </IconButton>
            
            </>
        }  },
        
    ];
    
    console.log(data)

    let ListaProps = {
        style:{
            marginTop: '50px'
        },
        columns: columns,
        rows: data !== undefined ? data.document : []  ,
        isLoading: isLoading
    }

    return <Grid container spacing={2} justifyContent="center"> 

    <Grid item xs={12} md={10} lg={10} xl={10}> 
        {
            !error && data !== undefined ?  <Lista {...ListaProps}></Lista> : error ? 'Ocorreu um erro' : 'Não há dados para exibição' 
        }
         <Stack direction="row" justifyContent="space-between" style={{marginTop: '20px'}}>
            <Pagination count={data?.count} onChange={handleChange} ></Pagination>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                                <InputLabel id="limit-page-label">Limite</InputLabel>
                                    <Select
                                        labelId="limit-page-label"
                                        id="limit-page"
                                        value={limit}
                                        onChange={(event) => {
                                            setLimit(event.target.value)
                                        }}
                                        label="Limit"
                                    >
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={15}>15</MenuItem>
                                </Select>
                            </FormControl>
        </Stack>
    </Grid>
    <Grid item xs={12} md={12} lg={12} xl={12}></Grid>

    </Grid>
    
}       

export default Documents