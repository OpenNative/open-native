#ifndef BASE64_H_C0CE2A47_D10E_42C9_A27C_C883944E704A
#define BASE64_H_C0CE2A47_D10E_42C9_A27C_C883944E704A

#include <string>

std::string base64_encode(const char* , unsigned int len);
std::string base64_decode(std::string const& s);

#endif /* BASE64_H_C0CE2A47_D10E_42C9_A27C_C883944E704A */
