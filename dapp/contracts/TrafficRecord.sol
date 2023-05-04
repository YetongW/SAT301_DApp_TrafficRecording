// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

/** @title Traffic Record. */
contract TrafficRecord{

    // a struct for vehicle storing Id,Identification, collision happend count ,EDRInfo and boolean to check if it is registered
    struct Vehicle{
        uint Id;
        string Identification;
        uint CollisionCount;
        string EDRInfo;
        bool Registered;
    }

    // mapping to map each struct with the address
    mapping(address => Vehicle) vehicles;

    Vehicle[] vehicle_record;

    uint vehicle_id;

    // events to record some data
    event vehicleRegistered(uint id);

    // modifiers 
    modifier onlyVehicle{
        require(vehicles[msg.sender].Registered," Not registered");
        _;
    }

    /**
        @dev Registers a user as Vehicle
        @param _Identification  unique Identification of the vehicle
        @param _CollisionCount happend count of collision
    */
    function registerVehicle(string memory _Identification,uint _CollisionCount) public {

        require(!vehicles[msg.sender].Registered," Already registered");
        Vehicle storage vehicle = vehicles[msg.sender];
        vehicle_id++;
        vehicle.Id = vehicle_id;
        vehicle.Identification = _Identification;
        vehicle.CollisionCount = _CollisionCount;
        vehicle.Registered = true;
        vehicle_record.push(vehicles[msg.sender]);
        emit vehicleRegistered(vehicle.Id);

    }

    /**
        @dev Add new EDRInfo to a registered Vehicle (only one inforamtion at a time)
        @param _EDRInfo Information related to event recorder
        
    */
      function addNewEDRInfo(string memory _EDRInfo, uint _CollisionCount) public onlyVehicle{

        vehicles[msg.sender].EDRInfo = _EDRInfo;
        vehicles[msg.sender].CollisionCount = _CollisionCount;
        vehicle_record[vehicles[msg.sender].Id - 1].CollisionCount = _CollisionCount;
        vehicle_record[vehicles[msg.sender].Id - 1].EDRInfo = _EDRInfo;

    }

    /**
        @dev View record of the Vehicle only by itself
        @return id Id of the Vehicle struct
        @return CollisionCount  collsions count of the Vehicle accident
        @return Identification Identification of the Vehicle
        @return EDRInfo All the EDRInfo of the Vehicle
    */
    function viewRecord() public view onlyVehicle returns(uint id,uint CollisionCount,string memory Identification,string memory EDRInfo){

         id = vehicles[msg.sender].Id;
         CollisionCount = vehicles[msg.sender].CollisionCount;
         Identification = vehicles[msg.sender].Identification;
         EDRInfo = vehicles[msg.sender].EDRInfo;

    }

}