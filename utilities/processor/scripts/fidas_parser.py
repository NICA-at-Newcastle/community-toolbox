import os
import pandas as pd
from datetime import datetime, timedelta
from urllib.request import urlopen
from io import StringIO


def addGPS(readings, gps, gheader, tformat="%Y-%m-%d %H:%M:%S"):
    """Function for getting nearest timestamp gps location

        TODO - needs testing

    Args:
        readings: pandas dataframe object of readings
        gps: pandas dataframe object of gps coordinates
        rheader: header column of readings to index by
        gheader: header column of gps data to index by

    Returns:
        starttime: starttime of readings
        loc: data start location in the file

    """

    # if readings are in epoch
    # Timezone issues with the parser
    # readings.timestamp = readings.timestamp.astype("datetime64[s]") - timedelta(hours=1)
    readings.timestamp = readings.timestamp.astype("datetime64[s]")
    gps[gheader] = pd.to_datetime(gps[gheader], format=tformat)
    # remove millis
    gps[gheader] = gps[gheader].values.astype("datetime64[s]")
    # remove dublicates
    gps = gps.drop_duplicates(gheader, keep="last")
    gps_dt = pd.Series(gps[gheader].values, gps[gheader])
    # gps_dt.reindex(readings["timestamp"], method="nearest")
    readings["nearest"] = gps_dt.reindex(readings["timestamp"], method="nearest").values
    merged_df = pd.merge(
        readings, gps, how="left", left_on=["nearest"], right_on=[gheader]
    )
    return merged_df


def getStarts(source):
    """Function for getting the startdate and data start location

    Args:
        source: input file.

    Returns:
        starttime: starttime of readings
        loc: data start location in the file
        deviceid: device id of the sensor
    """
    loc = 0
    with urlopen(source) as f:
        for line in f:
            decoded = line.decode("ISO-8859-1")
            if decoded.startswith("Start at:"):
                s = decoded
            if decoded.startswith("Operator:"):
                deviceid = decoded
            if decoded.startswith("timestamp"):
                break
            loc += 1
    # extract datetime from string
    # starttime = pd.to_datetime(str(s.split(":", 1)[1].strip()).replace("-", "").replace("/", "-"))
    starttime = pd.to_datetime(
        str(s.split(":", 1)[1].strip()), format="%d/%m/%Y - %H:%M:%S"
    )
    deviceid = str(deviceid.split(":", 1)[1].strip())
    # convert from nanoseconds
    starttime = starttime.value / 10**9
    return starttime, loc, deviceid


def convertTime(data, starttime, human=True, version=2):
    """Function for adding start time for readings

    Args:
        data: pandas dataframe object of readings
        starttime: starttime of readings
        human: boolean for converting to human readable time from epoch

    Returns:
        data: converted pandas dataframe object of readings
    """
    if version < 2:
        data.timestamp = (data.timestamp + starttime).astype(int)
    if human:
        data.timestamp = data.timestamp.astype("datetime64[s]")
    return data


def privacyZone(data, minutes):
    """Function for cutting off start end of dataset

    Args:
        data: pandas dataframe object of readings
        minutes: minutes to cut off

    Returns:
        data: converted pandas dataframe object of readings
    """
    data2 = data.set_index("timestamp")
    tmin = pd.to_datetime(data2.index.min() + timedelta(minutes=minutes))
    tmax = pd.to_datetime(data2.index.max() - timedelta(minutes=minutes))
    data = data[
        data.timestamp.apply(lambda x: x > tmin)
        & data.timestamp.apply(lambda x: x < tmax)
    ]
    return data


def processFile(
    filepath,
    outputpath=None,
    gpsfile=None,
    gpsheader=None,
):
    """Function for processing the sensor file

        TODO - needs testing

    Args:
        filepath: filepath to the sensor file
        gpsfile: filepath to the GPS file
        gpsheader: header column of GPS data file to index by
        outputpath: filepath to of the output directory

    Returns:
        csv_buffer: returns a buffer of the csv fuke
    """
    print("Working on " + filepath)
    start, loc, deviceid = getStarts(filepath)
    data = pd.read_csv(
        filepath,
        skiprows=loc,
        index_col=False,
        sep="\t",
        header=0,
        encoding="ISO-8859-1",
    )
    data = convertTime(data, start)
    # add deviceid
    data["device_id"] = deviceid
    if gpsheader is not None:
        gps = pd.read_csv(gpsfile, sep=",", header=0)
        data = addGPS(data, gps, gpsheader)
        # data = addGPS(data,gps,"YYYY-MO-DD HH-MI-SS_SSS")
    # clean up column names
    data.columns = (
        data.columns.str.lower().str.replace(":", "").str.strip().str.replace(" ", "_")
    )
    # custom header
    header = [
        "timestamp",
        "pm_1",
        "pm_2.5",
        "pm_4",
        "pm_10",
        "pm_tot.",
        "dcn",
        "latitude",
        "longitude",
        "temperature_[°c]",
        "rel._humidity_[%]",
        "ambient_pressure_[hpa]",
    ]
    if outputpath is None:
        outputpath = os.path.basename(filepath) + "_id-" + deviceid + ".csv"
    else:
        outputpath = (
            outputpath + "/" + os.path.basename(filepath) + "_id-" + deviceid + ".csv"
        )

    # data.columns = header
    csv_buffer = StringIO()
    data.to_csv(
        csv_buffer,
        index=False,
        columns=header,
        encoding="utf-8",
        date_format="%Y-%m-%d %H:%M:%S",
    )
    return csv_buffer, outputpath
