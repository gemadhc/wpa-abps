'use client'
import AddressSelection from "../../components/AddressSelection"
import {useState, useEffect} from 'react'
import {requestAddresses} from "../../actions/session.js"
import WaterLoader from "@/components/WaterLoader"
import { useSession } from "@/helpers/session";
import { requestGauge } from "@/actions/session.js"
import { format } from "date-fns"
 
export default function Home() {
	const [list, setList] = useState([])
  const [filelist, setFileList] = useState([])
  const [opening, setOpening] = useState(false)
  const [loading, setLoading] = useState(false)
  const [gauge, setGauge] = useState(null)
  const {session} = useSession()

  useEffect(()=>{
    console.log("my session: ", session)

  }, [session])

  useEffect(()=>{
  	console.log("requesting addresses: ")
  	requestAddresses().then((data, err) =>{
  		console.log("data: ", data, typeof(data))
  		setList(data)
  	})

  }, [])


  useEffect(()=>{
      requestGauge().then((data) =>{
        console.log("data info: ", data)
        if(data.length){
          setGauge(data[0])
        }
        
      })
  }, [])

  const getter = async() =>{
    let response = await fetch( process.env.GET_FILES, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json"
      }
    })
    let data = await response.json(); 
    console.log("this the data from requesting files: ", data)
    return data; 
  }

  const linkGetter = async(itm) =>{
    let response = await fetch( process.env.GET_LINK, {
      method: "POST", 
      body: JSON.stringify({
        itemId: itm.ItemId
      }), 
      headers: {
        "Content-Type": "application/json"
      }
    })
    let data = await response.json(); 
    console.log("this the data from requesting files: ", data)
    return data; 
  }

  useEffect( () => {
    const loadFiles = async () => {
      setLoading(true)
      const newList = await getter();
      setFileList(newList || []);
      setLoading(false)
    };

    loadFiles();
  }, [])

  const reload = () =>{
    requestAddresses().then((data, err) =>{
      console.log("data: ", data, typeof(data))
      setList(data)
    })
  }

  const handleNavLink = async (itm)=>{
    setOpening(true)
    let getlink =  await linkGetter(itm); 
    const a = document.createElement("a");
    a.href = getlink.link.webUrl;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
    setTimeout(()=> setOpening(false), 2000)
  }
  return (
    <div className="min-h-screen px-5 py-30 bg-white text-black ">

    	<div className = "p-6 bg-white rounded-lg shadow-sm border border-gray-200"> 
    		<AddressSelection 
    			addresses = {list }
          reload = {reload}
    		/>
    	</div>

      <div className = "p-6 bg-white rounded-lg shadow-sm border border-gray-200"> 
        <h2 className = "mb-5">My Gauge</h2>
        <p>
          {
            gauge ?
              <> 
                SN#-model: <i>{gauge.serialN}  -  {gauge.model}</i> <br/>
                Last calibration date: <i>{ format( gauge.calibrationDate, "MM/dd/yyyy")} </i> 
              </>
            : 
              <> NA</>
          }

          
        </p>
      </div>
      <div className = "p-6 bg-white rounded-lg shadow-sm border border-gray-200"> 
        <h2 className="text-sm font-semibold text-gray-800 mb-5"> Links</h2>
        {
          opening ? 
            <p className = "p-2 bg-amber-50 border border-amber-800 rounded"> Taking you there... </p>
          : 
            <> 
              {
                loading? 
                  <WaterLoader />
                : 
                  <> 
                    {
                      filelist.map( (item, ind) =>{
                        return(
                          <div
                            key = {ind}
                            onClick = { ()=> handleNavLink(item) } 
                            className="py-2"> 
                            {item.Name}
                          </div>
                        )
                      })

                    }
                  </>
              }
            </>
        }

        
      </div>
    </div>
  );
}
