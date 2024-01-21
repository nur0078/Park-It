import {
    Badge, Box, Button, ButtonGroup, Flex, HStack, IconButton, Input, SkeletonText, Text,
  } from "@chakra-ui/react";
  import { FaLocationArrow, FaTimes } from "react-icons/fa";
  import {
    useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer,
  } from "@react-google-maps/api";
  import { useEffect, useRef, useState } from "react";
  
  // Default Marker Position
  const center = { lat: -33.8568, lng: 151.2153 };
  
  function App() {
    useEffect(() => {
      document.title = "PARK IT";
    }, []);
  
    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries: ["places"],
    });
  
    const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [distance, setDistance] = useState("");
    const [duration, setDuration] = useState("");
  
    const originRef = useRef();
    const destinationRef = useRef();
    let data = "";
    // const [parkingInfo, setParkingInfo] = useState({
    //   nearestParking: '',
    //   totalCapacity: 0,
    //   availableSpots: 0
    // });
  
    if (!isLoaded) {
      return <SkeletonText />;
    }
  
    async function calculateRoute() {
      if (originRef.current.value === "" || destinationRef.current.value === "") {
        return;
      }
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,

        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      });
      setDirectionsResponse(results);
      setDistance(results.routes[0].legs[0].distance.text);
      setDuration(results.routes[0].legs[0].duration.text);
      // fetchParkingData(results.routes[0].legs[0].end_location);
    }
  
    async function fetchParkingData(destination) {
      try {
        
        const response = await fetch(`${process.env.REACT_APP_API_URL_FOR_PARKING_DATA}/carpark?facility=`, {
            headers: {
              'accept': 'application/json',
              'Authorization': `apikey ${process.env.REACT_APP_CAR_PARK_API_KEY}`
            }
          });
          
         data = await response.json();
  
        console.log(data);

        // data.parkingSpots.forEach(parkingSpot => {
        //   const distance = getDistanceFromLatLonInKm(
        //     destination.lat(), 
        //     destination.lng(), 
        //     parkingSpot.latitude, 
        //     parkingSpot.longitude
        //   );
  
        //   if (distance < minDistance) {
        //     minDistance = distance;
        //     nearestParking = parkingSpot;
        //   }
        // });
  
        // if (nearestParking) {
        //   setParkingInfo({
        //     nearestParking: nearestParking.name,
        //     totalCapacity: nearestParking.spots,
        //     availableSpots: nearestParking.spots - nearestParking.occupancy
        //   });
        // }
      } catch 
      (error) {
      console.error('Error fetching parking data:', error);
      }
      }
      
      function clearRoute() {
      setDirectionsResponse(null);
      setDistance("");
      setDuration("");
      originRef.current.value = "";
      destinationRef.current.value = "";
      // setParkingInfo({
      // nearestParking: '',
      // totalCapacity: 0,
      // availableSpots: 0});
      }
      
      // // Haversine formula to calculate the distance between two lat-long coordinates
      // function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
      // const R = 6371; // Radius of the earth in km
      // const dLat = deg2rad(lat2 - lat1);
      // const dLon = deg2rad(lon2 - lon1);
      // const a =
      // Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      // Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      // Math.sin(dLon / 2) * Math.sin(dLon / 2);
      // const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      // return R * c; // Distance in km
      // }
      
      // function deg2rad(deg) {
      // return deg * (Math.PI / 180);
      // }

      return (
        <div className="flex">
      <Flex
        position="relative"
        flexDirection="column"
        alignItems="center"
        h="100vh"
        w="100vw"
      >
        <Box position="absolute" left={0} top={0} h="100%" w="100%">
          {/* Google Map Box */}

          <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              zoomControl: false,
              // streetViewControl: false,
              // mapTypeControl: false,
              fullscreenControl: false,
            }}
            onLoad={(map) => setMap(map)}
          >
            <Marker position={center} />

            {/* Displaying markers, or directions */}

            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
        </Box>

        <Box
          p={4}
          borderRadius="lg"
          mt={4}
          bgColor="white"
          shadow="base"
          maxW="container.md"
          zIndex="docked"
        >
          <Text
            color="black"
            fontWeight="bold"
            letterSpacing="wide"
            fontSize="xl"
            textTransform="uppercase"
            textAlign="center"
            margin="3"
          >
            PARK IT
          </Text>

          <HStack spacing={4}>
            <Autocomplete>
              <Input type="text" placeholder="From" ref={originRef} />
            </Autocomplete>

            <Autocomplete>
              <Input type="text" placeholder="To" ref={destinationRef} />
            </Autocomplete>

            <ButtonGroup>
              <Button colorScheme="pink" type="submit" onClick={calculateRoute}>
                Calculate Route
              </Button>
              <IconButton
                aria-label="center back"
                icon={<FaTimes />}
                onClick={clearRoute}
              />
            </ButtonGroup>
          </HStack>
          <HStack spacing={4} mt={4} justifyContent="space-between">
            <Text>Distance: {distance} </Text>
            <Text>Duration: {duration} </Text>
            <IconButton
              aria-label="center back"
              icon={<FaLocationArrow />}
              isRound
              onClick={() => {
                map.panTo(center);
                map.setZoom(15);
              }}
            />
          </HStack>
          
        </Box>


        <Box p={4} mt={4} bgColor="white"  shadow="base" zIndex="modal">
          <Text>JSON DATA: {data} </Text>
      {/* <Text fontWeight="bold">Nearest Parking: {parkingInfo.nearestParking}</Text>
      <Text>Total Capacity: {parkingInfo.totalCapacity}</Text>
      <Text>Available Spots: {parkingInfo.availableSpots}</Text> */}
    </Box>
      </Flex>

      {/* Additional UI for displaying parking information */}
  
   
    </div>
  );
}

export default App;
