<?php

function kebabToCamel($str){
	return str_replace('-', '', lcfirst(ucwords($str, '-')));
}