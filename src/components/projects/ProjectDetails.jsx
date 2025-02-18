import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const ProjectDetails = () => {
    const {projectId} = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    
    return (
        <div>ProjectDetails</div>
    )
}

export default ProjectDetails