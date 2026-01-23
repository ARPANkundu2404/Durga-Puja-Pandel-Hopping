package com.arpan.durga_puja_hopping.dto;

public class PandalCreateRequest {

    private String name;
    private String address;
    private String zone;
    private String details;

    // getters & setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
