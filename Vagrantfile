# -*- mode: ruby -*-
# vi: set ft=ruby :

PROJECT_NAME = "seimur"

Vagrant.configure("2") do |config|
  config.vm.box = "bento/ubuntu-16.04"
  config.vm.hostname = PROJECT_NAME
  ENV["LC_ALL"] = "en_US.UTF-8"
  config.vm.network "forwarded_port", guest: 8000, host: 8000  # aiohttp

  config.vm.provision :shell, path: "provision.sh", args: PROJECT_NAME
end
