<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Storage;

class TestController extends Controller
{
    public function test() {


        
        // $dir = '/';
        // $recursive = false;
        // $contents = collect($googleDriveStorage->listContents($dir, $recursive));
 
        // dd($contents);

        $filename = "1689063635.png";

        $folderChildID = '1yRKnxiy2TonmNEV7mBPVzMWGVY--cG5X/';

        $listContents = Storage::disk('google')->listContents($folderChildID, true);
        $id = $this->getId($listContents, 'name', $filename);

        

        dd(str_replace($folderChildID, null, $id['path']));


    }

    function getId(Array $array, $key, $value) {   
        foreach ($array as $subarray) {  
            if (isset($subarray[$key]) && $subarray[$key] == $value)
            return $subarray;       
        } 
    }



}
