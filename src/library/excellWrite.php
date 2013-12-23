<?php
/**
 * Created by IntelliJ IDEA.
 * User: Yuvielle
 * Date: 02.12.13
 * Time: 1:32
 * To change this template use File | Settings | File Templates.
 */
require_once(dirname(__FILE__) . '/excellProcessor/PHPExcel.php');
class library_excellWrite
{
    private $objPHPExcel;
    private $tempPath;
    private $letters = array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q');
    public function __construct()
    {
        $this->objPHPExcel = new PHPExcel();
        $this->tempPath = realpath(dirname(__FILE__) . '/../web/temp/');
    }

    public function setHeaders()
    {
        $this->objPHPExcel->getProperties()->setCreator("OLDI")
            ->setLastModifiedBy("OLDI")
            ->setTitle("Office 2007 XLSX pays")
            ->setSubject("Office 2007 XLSX pays")
            ->setDescription("pays document for Office 2007 XLSX, generated using PHP classes.")
            ->setKeywords("oldi regplat")
            ->setCategory("provider files");
    }

    public function addData(array $headers, array $data)
    {
        // Create a first sheet
        $this->objPHPExcel->setActiveSheetIndex(0);
        $this->objPHPExcel->getActiveSheet();
        foreach(array_keys($headers) as $i=>$name){
            $this->objPHPExcel->getActiveSheet()->setCellValue($this->letters[$i] . '1', $headers[$name]);
        }
        // Add data
        foreach($data as $i=>$row) {
            foreach(array_keys($row) as $j=>$name){
                $this->objPHPExcel->getActiveSheet()->setCellValue($this->letters[$j] . $i, $row[$name]);
                // Add page breaks every 50 rows
                if ($i % 50 == 0) {
                    $this->objPHPExcel->getActiveSheet()->setBreak('A' . $i, PHPExcel_Worksheet::BREAK_ROW);
                }
            }
        }
        // Set active sheet index to the first sheet, so Excel opens this as the first sheet
        $this->objPHPExcel->setActiveSheetIndex(0);
    }

    public function save()
    {
        $objWriter = PHPExcel_IOFactory::createWriter($this->objPHPExcel, 'Excel2007');
        header("Content-Type: application/vnd.ms-excel");
        header('Content-Disposition: attachment; filename="pays.xlsx"');
        $objWriter->save('php://output');
    }
}
