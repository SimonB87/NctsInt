# CSV files for Error pointer map
---------------------------------

CSV files have been prepared for Declaration forms to see human-readable captions related to client validation errors.

## Preparation
--------------

Use the utility called CaptionsForSummary which is part of sffw project now. Save it to a folder and in the command line run following command from the folder where this utility is stored:

CaptionsForSummary.exe MODEL PATH\MECustomsSF\NctsInt\MODEL

where MODEL is the name of SF package which you want to prepare for Error Pointer Map. And where PATH is the path to the MODEL package file. Folder _validationCSVs is created and csv files are generated.

## Adjustment of CSV files
--------------------------

For NCTS Int we want to use csv files - DeclarationHeader, HouseConsignment and ConsignmentItem. Declaration Header we can use as is, HouseConsignment and ConsignmentItem files have to be adjusted.

### HouseConsignment
--------------------

#### Step 1
-----------

We copy the first column from the DeclarationHeader.csv, we add Header/ to the beginning of each line - example: on the first line there is GUID and we want to get Header/GUID. We can paste it to a new csv file - e.g. HouseConsignment_v2.csv.
The reason is that on the HouseConsignment form, we have complex called Header which represents Header.

#### Step 2
-----------

Then we copy the second column from the DeclarationHeader.csv, we add ${L_main$$Header} > to the beginning of each line - example: on the first line there is ${L_Model$$GUIDOfDeclaration} and we want to get ${L_main$$Header} > ${L_Model$$GUIDOfDeclaration}. We can paste it in the second column in HouseConsignment_v2.csv.
The reason is that caption Header is translated in the package main (L_ represents localizations).

#### Step 3
-----------

Then we copy the first column from the HouseConsignment.csv, we add Model/ to the beginning of each line - example: on the first line there is sequenceNumber and we want to get Model/sequenceNumber. We can paste it in the second column in HouseConsignment_v2.csv.
The reason is that on the HouseConsignment form we have complex called Model which represents House Consignment.
Then we copy the second column from the HouseConsignment.csv and paste it in the second column in HouseConsignment_v2.csv without any further changes.

## Generation of definitions for Error pointer map
--------------------------------------------------

Open the ItemsGenerationHelper.xlsm which is part of the sffw project. Copy everything from the HouseConsignment_v2.csv and paste it to the List1 in the ItemsGenerationHelper. On the tab Doplňky run the command Export rows as definitions for ErrorPointerMap api object. XML definition is copied in the clipboard. Such a XML can be pasted in the HouseConsignment.form where the ErrorPointerMap is defined (it is necessary to add the ErrorPointerMap as API object to the form and connect it to the Client Validation Summary). XML contains whole items block which can be pasted just after Name of ErrorPointerMap.

## Run the project and test the outcome
---------------------------------------

## Similarly adjust the ConsignmentItem
---------------------------------------
