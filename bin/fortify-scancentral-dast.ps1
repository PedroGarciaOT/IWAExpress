#
# Example script to perform Fortify ScanCentral DAST dynamic analysis including status checking and polling
#

    [CmdletBinding()]
param (
    [Parameter(Mandatory)]
    [string]$ApiUri,

    [Parameter(Mandatory)]
    [string]$Username,

    [Parameter(Mandatory)]
    [string]$Password,

    [Parameter(Mandatory)]
    [string]$CiCdToken,

    [Parameter()]
    [string]$ScanName = 'PowerShell initiated scan',

    [Parameter()]
    [int]$PollingInterval = 30,

    [Parameter()]
    [switch]$Raw
)
begin {
    # Fortify Security Token
    $FortifyToken = ""

    # Fortify Scan Id
    $ScanId = ""

    # Fortify Scan Status values
    $ScanStatusValues = @{}

    # Default headers
    $Headers = @{
        'Accept' = "application/json"
        'Content-Type' = "application/json"
    }
}
process {
    $Response = $null

    # Authenticate to retrieve FORTIFYTOKEN
    Write-Host "Retrieving Fortify authentication token ..."
    $Body = @{
        username = $Username
        password = $Password
    }
    $Params = @{
        Uri = "$ApiUri/auth"
        ErrorAction = 'Stop'
        Method = 'POST'
        Body = (ConvertTo-Json $Body)
    }
    try  {
        $Response = Invoke-RestMethod -Headers $Headers @Params
        Write-Verbose $Response
        $FortifyToken = $Response.token
        $Headers.Add('Authorization', $FortifyToken)
    } catch {
        Write-Error -Exception $_.Exception -Message "eDAST API call failed: $_"
    }

    # Get possible scan status values
    Write-Host "Retrieving Fortify scan status values ..."
    $Params = @{
        Uri = "$ApiUri/utilities/lookup-items?type=ScanStatusTypes"
        ErrorAction = 'Stop'
        Method = 'GET'
    }
    try  {
        $Response = Invoke-RestMethod -Headers $Headers @Params
        $ScanStatusValues = $Response
    } catch {
        Write-Error -Exception $_.Exception -Message "eDAST API call failed: $_"
    }

    # Start the scan
    Write-Host "Starting scan using CiCd Token: $CiCdToken"
    $Body = @{
        name = $ScanName
        cicdToken = $CiCdToken
    }
    $Params = @{
        Uri = "$ApiUri/scans/start-scan-cicd"
        ErrorAction = 'Stop'
        Method = 'POST'
        Body = (ConvertTo-Json $Body)
    }
    try  {
        $Response = Invoke-RestMethod -Headers $Headers @Params
        Write-Verbose $Response
        $ScanId = $Response.id
        Write-Host "Started scan id: $ScanId"
    } catch {
        Write-Error -Exception $_.Exception -Message "eDAST API call failed: $_"
    }

    # Poll the scan
    Write-Host "Polling status of scan ..."
    $Params = @{
        Uri = "$ApiUri/scans/${ScanId}/scan-summary"
        ErrorAction = 'Stop'
        Method = 'GET'
    }
    $ScanResults = @{};
    do {
        Start-Sleep -s $PollingInterval # sleep for X seconds
        try  {
            $Response = Invoke-RestMethod -Headers $Headers @Params
            Write-Verbose $Response
            $ScanResults = $Response.item
            $ScanStatusId = ($Response.item.scanStatusType) - 1
            $ScanStatus = $ScanStatusValues.Item($ScanStatusId).text
        } catch {
            Write-Error -Exception $_.Exception -Message "eDAST API call failed: $_"
        }
        Write-Host "Scan id: '$ScanId' current status: $ScanStatus ($ScanStatusId)"
    } until ($ScanStatusId -in 4..6 -or $ScanStatusId -in 14..16)

    // TODO: download FPR
}
end {
    if ($Raw) {
        $Response
    } else {
        Write-Host "Results:"
        Write-Host "Scan name: " $ScanResults.name
        $dt = [datetime]::parseexact($ScanResults.startedDateTime, 'yyyy-MM-ddTHH:mm:ss.fffffff', $Null) 
        Write-Host "Started: " $dt
        $ts = [TImeSpan]::FromTicks($ScanResults.duration)
        Write-Host "Duration: " $ts.hours "hrs" $ts.minutes "mins" $ts.seconds "secs"
        Write-Host "Status: " $ScanStatus
        Write-Host "Requests: " $ScanResults.requestCount
        Write-Host "Failed Requests: " $ScanResults.failedRequestCount
        Write-Host "KB Sent / KB Received: " $ScanResults.kilobytesSent "/" $ScanResults.kilobytesReceived
        Write-Host "Critical: " $ScanResults.criticalCount
        Write-Host "High: " $ScanResults.highCount
        Write-Host "Medium: " $ScanResults.mediumCount
        Write-Host "Low: " $ScanResults.lowCount
    }
}
