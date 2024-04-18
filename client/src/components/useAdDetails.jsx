import axios from "axios"; // Custom hook to fetch and manage ad details.
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function useAdDetails(){
/**
 * Custom hook to fetch and manage ad details.
 * @returns {Object} An object containing the ad details.
 */
    const {id: adId } = useParams();
    const [ad, setAd] = useState({});
  
    
    useEffect(() => {
      // Fetches the ad details from the API.
      const fetchCategories = async () => {
        try {
            const response = await axios.get(`/api/ads/${adId}/`);
            setAd(response.data);
          } catch (error) {
            console.log(error)
          }
        }

    if (adId) {
      fetchAdDetails();
    }
  }, [adId]);

  return {
    ad
  };
}

export default useAdDetails;
