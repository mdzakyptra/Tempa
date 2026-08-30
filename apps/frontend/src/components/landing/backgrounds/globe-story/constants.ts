import * as THREE from "three";
import { MARKER } from "./beats";


export const RADIUS = 2.3;

//<---------- latLngToVector3 -------------->
export function latLngToVector3(lat: number, lng: number, radius = RADIUS) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

// Rotation that brings MARKER to face the camera (+Z axis) once the globe locks on.
export const LOCK_ROTATION_Y = (() => {
  const v = latLngToVector3(MARKER.lat, MARKER.lng, 1);
  return -Math.atan2(v.x, v.z);
})();
