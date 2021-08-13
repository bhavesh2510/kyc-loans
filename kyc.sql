-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 19, 2021 at 06:46 PM
-- Server version: 10.2.36-MariaDB
-- PHP Version: 7.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `xipetechxyz_kyc`
--

-- --------------------------------------------------------

--
-- Table structure for table `kyc`
--

CREATE TABLE `kyc` (
  `id` int(11) NOT NULL,
  `email` varchar(35) DEFAULT NULL,
  `comp_phone_no` varchar(15) NOT NULL,
  `ip` varchar(100) DEFAULT NULL,
  `location` varchar(50) DEFAULT NULL,
  `country_Incorporation` varchar(20) DEFAULT NULL,
  `company_number` varchar(64) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `incorporation_date` varchar(20) DEFAULT NULL,
  `address1` varchar(64) DEFAULT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `post_code` varchar(20) DEFAULT NULL,
  `vat_number` varchar(64) DEFAULT NULL,
  `dba` varchar(32) DEFAULT NULL,
  `dbaaddress1` varchar(200) DEFAULT NULL,
  `dbaaddress2` varchar(255) DEFAULT NULL,
  `dbacity` varchar(50) DEFAULT NULL,
  `dbapost_code` varchar(20) DEFAULT NULL,
  `website` varchar(64) DEFAULT NULL,
  `type` varchar(64) DEFAULT NULL,
  `offered_services` varchar(64) DEFAULT NULL,
  `annual_turnover` varchar(64) DEFAULT NULL,
  `card_sales` varchar(32) DEFAULT NULL,
  `avg_transaction` varchar(10) DEFAULT NULL,
  `max_amt_per_trans` varchar(10) DEFAULT NULL,
  `number_of_chargeback` int(5) DEFAULT 0,
  `new_card_process` varchar(5) DEFAULT NULL,
  `previous_acquirer` varchar(255) DEFAULT NULL,
  `account_name` varchar(64) DEFAULT NULL,
  `bank_name` varchar(64) DEFAULT NULL,
  `reg_nr` varchar(64) DEFAULT NULL,
  `account_number` bigint(20) DEFAULT NULL,
  `iban_number` varchar(64) DEFAULT NULL,
  `swift_bic` varchar(64) DEFAULT NULL,
  `sort_code` varchar(10) DEFAULT NULL,
  `copy_company_registration` text DEFAULT NULL,
  `proof_company_bank` text DEFAULT NULL,
  `passport_share_holder` text DEFAULT NULL,
  `address_proof_share_holder` text DEFAULT NULL,
  `signature` varchar(64) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `declaration` varchar(10) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `shareholders`
--

CREATE TABLE `shareholders` (
  `id` int(11) NOT NULL,
  `kyc_id` int(11) NOT NULL,
  `name` varchar(32) DEFAULT NULL,
  `percentage` varchar(10) DEFAULT NULL,
  `address1` text DEFAULT NULL,
  `address2` text DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `zipcode` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `passport_number` varchar(32) DEFAULT NULL,
  `nationality` varchar(32) DEFAULT NULL,
  `authorised_signatory` varchar(20) DEFAULT NULL,
  `beneficial_owner` varchar(20) DEFAULT NULL,
  `director` varchar(20) DEFAULT NULL,
  `email` varchar(35) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `kyc`
--
ALTER TABLE `kyc`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `shareholders`
--
ALTER TABLE `shareholders`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `kyc`
--
ALTER TABLE `kyc`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shareholders`
--
ALTER TABLE `shareholders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
