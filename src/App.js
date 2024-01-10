import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";

// Default Marker Position
const center = { lat: -33.8568, lng: 151.2153 };

function App() {
  // Code to select the destination (originRef) and finding a spot nearby such that a spot can be found.
  // SO, Spot Matcher, ParkingFinderInTheSpot, DirectionToTheParkingSpot
  // the direction shows upto parking matcher given that there's a spot available
  // PAGE TITLE

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

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();

  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();

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
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  }

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
      </Flex>
    </div>
  );
}

export default App;
