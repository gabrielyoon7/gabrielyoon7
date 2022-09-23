import Table from "../../components/Table";
import curriculum from "../../assets/data/curriculum";
import Score from "./Score";

export default () => {

    return (
        <>
            <div className="mb-3" >
                <h3>Curriculum</h3>
            </div>
            <div className="mb-3 overflow-scroll box" >
                <Table data={curriculum} rowsPerPage={10} />
            </div>
            <div className="mb-3" >
                <Score/>
            </div>
        </>
    )
}

